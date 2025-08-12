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

    // Query user-specific bookings subcollection ordered by createdAt
    const bookingsQuery = query(
      collection(db, "users", user.uid, "bookings"),
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

  // Add booking function expects booking object including city and area
  const addBooking = useCallback(
    async (booking) => {
      if (!user) {
        console.error("User not authenticated. Cannot add booking.");
        return;
      }

      try {
        // Save city and area inside booking document
        await addDoc(collection(db, "users", user.uid, "bookings"), {
          ...booking, // booking should include city and area fields
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error adding booking:", error);
      }
    },
    [user]
  );

  // Clear bookings deletes all booking docs for user
  const clearBookings = useCallback(async () => {
    if (!user) {
      console.warn("No user logged in, cannot clear bookings.");
      return;
    }

    try {
      const bookingsRef = collection(db, "users", user.uid, "bookings");
      const querySnapshot = await getDocs(bookingsRef);

      if (querySnapshot.empty) {
        setBookings([]);
        return;
      }

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
