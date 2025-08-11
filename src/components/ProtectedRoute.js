import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../context/firebase";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <p>Loading...</p>;

  // ✅ Allow logged-in users
  if (user) return children;

  // ❌ If not logged in & they clicked Services → go to Signup
  if (location.pathname === "/services") {
    return <Navigate to="/signup" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
