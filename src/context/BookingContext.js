import { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Function to add a new booking
  const addBooking = (item) => {
    setBookings((prev) => [...prev, item]);
  };

  // Function to clear all bookings
  const clearBookings = () => {
    setBookings([]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, clearBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
