// BookingContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
  doc,
  where,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // 🔹 Auth Listener + Firestore Sync
  useEffect(() => {
    let unsubscribeProfile = null;
    let unsubscribeBookings = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        if (unsubscribeProfile) unsubscribeProfile();
        if (unsubscribeBookings) unsubscribeBookings();

        setUserProfile(null);
        setBookings([]);
        setLoading(false);
        console.log("🔹 DEBUG: User signed out");
        return;
      }

      console.log("🔹 DEBUG: User signed in", currentUser.uid);

      // 🔹 Ensure Firestore user document exists
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email || "no-email",
            role: "user",
            name: currentUser.displayName || "Anonymous",
            createdAt: serverTimestamp(),
          });
          console.log("✅ Firestore user created for", currentUser.email || currentUser.uid);
        } else {
          console.log("ℹ️ Firestore user already exists:", currentUser.uid);
        }
      } catch (error) {
        console.error("❌ ERROR: Failed to sync Auth user to Firestore", error);
      }

      setLoading(false);

      // 🔹 Listen to user profile
      const userDocRef = doc(db, "users", currentUser.uid);
      unsubscribeProfile = onSnapshot(
        userDocRef,
        (snapshot) => {
          setUserProfile(snapshot.exists() ? snapshot.data() : null);
          console.log("🔹 DEBUG: User profile snapshot received", snapshot.data());
        },
        (error) => {
          console.error("Firestore Error (profile):", error);
          setUserProfile(null);
        }
      );

      // 🔹 Listen to user bookings (subcollection)
      const bookingsQuery = query(
        collection(db, "users", currentUser.uid, "bookings"),
        orderBy("createdAt", "asc")
      );
      unsubscribeBookings = onSnapshot(
        bookingsQuery,
        async (snapshot) => {
          const userBookings = snapshot.docs.map((doc) => {
            const data = doc.data();
            // 🔹 Ensure beforeAfter field exists
            if (!data.beforeAfter) data.beforeAfter = { before: [], after: [] };
            return { id: doc.id, ...data };
          });

          // 🔹 Auto-update Firestore if missing beforeAfter
          for (const b of userBookings) {
            const bookingRef = doc(db, "users", currentUser.uid, "bookings", b.id);
            const topLevelRef = doc(db, "bookings", b.id);
            await updateDoc(bookingRef, { beforeAfter: b.beforeAfter }).catch(() => {});
            await updateDoc(topLevelRef, { beforeAfter: b.beforeAfter }).catch(() => {});
          }

          setBookings(userBookings);
          console.log("🔹 DEBUG: Bookings snapshot received", userBookings);
        },
        (error) => {
          console.error("Failed to fetch bookings:", error);
        }
      );
    });

    return () => {
      authUnsubscribe();
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeBookings) unsubscribeBookings();
    };
  }, []);

  // 🔹 Add Booking
  const addBooking = useCallback(
    async (bookingData) => {
      if (!user?.uid || !userProfile) return;
      try {
        const bookingId = doc(collection(db, "bookings")).id;
        const newBooking = {
          ...bookingData,
          userId: user.uid,
          username: userProfile?.name || "Anonymous",
          status: "Pending",
          createdAt: serverTimestamp(),
          beforeAfter: { before: [], after: [] }, // 🔹 initialize beforeAfter
        };

        // Save in top-level + user subcollection
        await setDoc(doc(db, "bookings", bookingId), newBooking);
        await setDoc(doc(db, "users", user.uid, "bookings", bookingId), newBooking);

        setBookings((prev) => [...prev, { id: bookingId, ...newBooking }]);

        console.log("✅ Booking added to Firestore", newBooking);
      } catch (error) {
        console.error("❌ Error adding booking:", error);
      }
    },
    [user, userProfile]
  );

  // 🔹 Update Booking Status
  const updateBookingStatus = useCallback(async (bookingId, userId, newStatus) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: newStatus });

      const userBookingRef = doc(db, "users", userId, "bookings", bookingId);
      const userBookingSnap = await getDoc(userBookingRef);
      if (userBookingSnap.exists()) {
        await updateDoc(userBookingRef, { status: newStatus });
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );

      console.log(`✅ Booking ${bookingId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("❌ Error updating booking status:", error);
    }
  }, []);

  // 🔹 Delete Booking
  const deleteBooking = useCallback(async (bookingId, userId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));

      const userBookingRef = doc(db, "users", userId, "bookings", bookingId);
      const userBookingSnap = await getDoc(userBookingRef);
      if (userBookingSnap.exists()) {
        await deleteDoc(userBookingRef);
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      console.log(`✅ Booking ${bookingId} deleted`);
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
    }
  }, []);

  // 🔹 Clear All Bookings
  const clearBookings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const userBookingsRef = collection(db, "users", user.uid, "bookings");
      const userSnapshot = await getDocs(userBookingsRef);
      const batch = writeBatch(db);
      userSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();

      const topLevelBookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
      const topLevelSnapshot = await getDocs(topLevelBookingsQuery);
      const topLevelBatch = writeBatch(db);
      topLevelSnapshot.forEach((docSnap) => topLevelBatch.delete(docSnap.ref));
      await topLevelBatch.commit();

      setBookings([]);
      console.log("✅ All bookings cleared for user", user.uid);
    } catch (error) {
      console.error("❌ Error clearing bookings:", error);
    }
  }, [user]);

  // 🔹 Admin: Update User Role
  const updateUserRole = useCallback(
    async (userId, newRole) => {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { role: newRole });

        if (userProfile?.uid === userId) {
          setUserProfile((prev) => ({ ...prev, role: newRole }));
        }

        console.log(`✅ Role of ${userId} updated to ${newRole}`);
      } catch (error) {
        console.error("❌ Error updating user role:", error);
      }
    },
    [userProfile]
  );

  return (
    <BookingContext.Provider
      value={{
        user,
        userProfile,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        clearBookings,
        updateUserRole,
        loading,
        selectedCity,
        setSelectedCity,
        selectedArea,
        setSelectedArea,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
