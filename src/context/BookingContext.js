import React, { createContext, useState, useEffect, useCallback } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setBookings([]); // Clear bookings on logout
    });
    return () => unsubscribe();
  }, []);

  // Listen to bookings subcollection for current user
  useEffect(() => {
    if (!user) return;

    // *** UPDATED: Query user-specific subcollection bookings ***
    const bookingsQuery = query(
      collection(db, "users", user.uid, "bookings"), // <-- changed path here
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        setBookings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        console.error("Error fetching bookings:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // addBooking wrapped in useCallback
  const addBooking = useCallback(
    async (booking) => {
      if (!user) {
        console.error("User not authenticated. Cannot add booking.");
        return;
      }

      try {
        // *** UPDATED: Add booking to user's bookings subcollection ***
        await addDoc(collection(db, "users", user.uid, "bookings"), {
          ...booking,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error adding booking:", error);
      }
    },
    [user]
  );

  // clearBookings updated to delete documents from user's bookings subcollection
  const clearBookings = useCallback(async () => {
    if (!user) {
      console.warn("No user logged in, cannot clear bookings.");
      return;
    }

    try {
      //  UPDATED: Reference to user's bookings subcollection ***
      const bookingsRef = collection(db, "users", user.uid, "bookings");

      // Get all booking docs for this user
      const querySnapshot = await getDocs(bookingsRef);

      if (querySnapshot.empty) {
        setBookings([]);
        return;
      }

      // Batch delete all booking docs
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setBookings([]);
      console.log("All bookings deleted from Firestore and cleared from state.");
    } catch (error) {
      console.error("Error clearing bookings:", error);
    }
  }, [user]);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, clearBookings, user }}>
      {children}
    </BookingContext.Provider>
  );
};
