import React, { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../context/firebase"; // adjust path if needed
import "../App.css";

const Profile = () => {
  const { userProfile, bookings } = useContext(BookingContext);
  const navigate = useNavigate();

  // 🔹 Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (!userProfile) {
    return (
      <div className="profile-container center">
        <p className="info-text">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <h2 className="profile-name">{userProfile.name || "User"}</h2>
        <p className="profile-email">{userProfile.email}</p>
        <p className="profile-role">
          <strong>Role:</strong> {userProfile.role || "User"}
        </p>
      </div>

      {/* Orders Section */}
      <div className="profile-orders">
        <h3 className="orders-title">My Orders</h3>
        {bookings && bookings.length > 0 ? (
          <ul className="orders-list">
            {bookings.map((order, idx) => (
              <li key={idx} className="order-card">
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Service:</strong>{" "}
                  {order.name || order.category || order.desc || "Unknown"}
                </p>
                <p>
                  <strong>Status:</strong> {order.status || "Pending"}
                </p>
                <p>
                  <strong>Contractor:</strong>{" "}
                  {order.contractorName ||
                    order.contractorDetails?.name ||
                    "Not Assigned"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="info-text">You have no orders yet.</p>
        )}
      </div>

      {/* Logout Button at Bottom */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
