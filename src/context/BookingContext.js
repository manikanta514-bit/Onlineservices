// BookingContext.js
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
  doc,
  where,
  // eslint-disable-next-line no-unused-vars
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

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setBookings([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeProfile = onSnapshot(
      userDocRef,
      (snapshot) => setUserProfile(snapshot.exists() ? snapshot.data() : null),
      (error) => {
        console.error("Firestore Error:", error);
        setUserProfile(null);
      }
    );
    return () => unsubscribeProfile();
  }, [user]);

  // Fetch user bookings
  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    setLoading(true);
    const bookingsQuery = query(
      collection(db, "users", user.uid, "bookings"),
      orderBy("createdAt", "asc")
    );
    const unsubscribeBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const userBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(userBookings);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch bookings:", error);
        setLoading(false);
      }
    );
    return () => unsubscribeBookings();
  }, [user]);

  // Add booking
  const addBooking = useCallback(
    async (bookingData) => {
      if (!user) return;
      const newBooking = {
        ...bookingData,
        userId: user.uid,
        status: "Pending",
        createdAt: serverTimestamp(),
      };
      try {
        await addDoc(collection(db, "bookings"), newBooking); // Top-level
        await addDoc(collection(db, "users", user.uid, "bookings"), newBooking); // User subcollection
      } catch (error) {
        console.error("Error adding booking:", error);
      }
    },
    [user]
  );

  // Clear all bookings (removes from both top-level and user subcollection)
  const clearBookings = useCallback(async () => {
    if (!user) return;
    try {
      // 1️⃣ Delete from user's subcollection
      const userBookingsRef = collection(db, "users", user.uid, "bookings");
      const userSnapshot = await getDocs(userBookingsRef);
      const batch = writeBatch(db);
      userSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));
      await batch.commit();

      // 2️⃣ Delete from top-level bookings collection
      const topLevelBookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
      const topLevelSnapshot = await getDocs(topLevelBookingsQuery);
      const topLevelBatch = writeBatch(db);
      topLevelSnapshot.forEach((docSnap) => topLevelBatch.delete(docSnap.ref));
      await topLevelBatch.commit();

      // Clear local state
      setBookings([]);
    } catch (error) {
      console.error("Error clearing bookings:", error);
    }
  }, [user]);

  return (
    <BookingContext.Provider
      value={{
        user,
        userProfile,
        bookings,
        addBooking,
        clearBookings,
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
