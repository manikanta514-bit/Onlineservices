import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "../App.css";

const Services = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        navigate("/signup", { replace: true }); // redirect if no account
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <h2>Checking authentication...</h2>
      </div>
    );
  }

  return (
    <div className="page-content">
      <h1 className="text-center">Our Services</h1>

      {user && (
        <p className="text-center" style={{ marginTop: "10px", fontWeight: "bold" }}>
          Welcome, {user.displayName || user.email}!
        </p>
      )}

      <div className="mani-intro">
        <p>
          At <b>Online Services</b>, we go beyond just providing solutions —
          we bring convenience, quality, and trust to your doorstep.
        </p>
        <p>
          Whether you need a sparkling clean home, quick and efficient repairs,
          or expert installations, we've got you covered.
        </p>
        <p>
          Join thousands of satisfied customers who trust us. Book a service today!
        </p>
        <div className="mani-cta">
          <h2>Click the service you want to choose</h2>
          <p>Select Cleaning, Repair, or Installation services easily.</p>
        </div>
      </div>

      <div className="mani-grid">
        <div className="mani-box" onClick={() => navigate("/cleaning")}>
          <i className="fas fa-spray-can fa-3x text-orange-600"></i>
          <h3>Cleaning</h3>
          <p>Professional home & office cleaning with eco-friendly products.</p>
        </div>

        <div className="mani-box" onClick={() => navigate("/repairs")}>
          <i className="fas fa-wrench fa-3x text-orange-600"></i>
          <h3>Repairs</h3>
          <p>Expert technicians for appliances, plumbing, and electrical work.</p>
        </div>

        <div className="mani-box" onClick={() => navigate("/installations")}>
          <i className="fas fa-hammer fa-3x text-orange-600"></i>
          <h3>Installations</h3>
          <p>Furniture, electronics, and appliances set up perfectly.</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <button className="back-home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Services;
