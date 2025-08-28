import React, { useState, useEffect, useMemo, useContext } from "react";
import { db } from "../context/firebase";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { FaBars, FaTimes, FaUser, FaBook } from "react-icons/fa";
import "../App.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState("users"); // default: users
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const { updateBookingStatus } = useContext(BookingContext);

  // Fetch Users
  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(
      usersRef,
      (snapshot) =>
        setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
      (error) => console.error("Error fetching users:", error)
    );
    return () => unsubscribe();
  }, []);

  // Fetch Bookings
  useEffect(() => {
    setLoading(true);
    const bookingsRef = collection(db, "bookings");
    const unsubscribe = onSnapshot(
      bookingsRef,
      (snapshot) => {
        setBookings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return bookings.filter(
      (b) =>
        b.name?.toLowerCase().includes(search) ||
        b.userEmail?.toLowerCase().includes(search) ||
        b.status?.toLowerCase().includes(search)
    );
  }, [bookings, searchTerm]);

  // Delete Booking
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Delete this booking permanently?")) {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  // Update Booking Status
  const handleUpdateStatus = async () => {
    if (!editingBookingId || !newStatus) return;
    try {
      const booking = bookings.find((b) => b.id === editingBookingId);
      if (!booking) return;
      await updateBookingStatus(editingBookingId, booking.userId, newStatus);
      setEditingBookingId(null);
      setNewStatus("");
      alert(`Booking status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };

  // Update User Role
  const handleUpdateUserRole = async () => {
    if (!editingUserId || !newRole) return;
    const previousUser = users.find((u) => u.id === editingUserId);
    const previousRole = previousUser?.role || "user";
    try {
      await updateDoc(doc(db, "users", editingUserId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId ? { ...u, role: newRole } : u
        )
      );
      setEditingUserId(null);
      setNewRole("");
      if (previousRole !== newRole)
        alert(`Role updated: ${previousRole} → ${newRole}`);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update role. Please try again.");
    }
  };

  if (loading) return <h1>Loading Dashboard...</h1>;

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <ul className="menu">
          <li
            className={activeMenu === "users" ? "active" : ""}
            onClick={() => setActiveMenu("users")}
          >
            <FaUser className="icon" /> {sidebarOpen && "Users"}
          </li>
          <li
            className={activeMenu === "bookings" ? "active" : ""}
            onClick={() => setActiveMenu("bookings")}
          >
            <FaBook className="icon" /> {sidebarOpen && "Bookings"}
          </li>
        </ul>
      </div>

      {/* Main Dashboard Content */}
      <div className={`dashboard-content ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <h1>Admin Dashboard</h1>

        {/* USERS VIEW */}
        {activeMenu === "users" && (
          <>
            <h2>All Users ({users.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email || "No Email"}</td>
                        <td>
                          {editingUserId === user.id ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className={`status-badge ${user.role || "user"}`}>
                              {user.role || "user"}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingUserId === user.id ? (
                            <>
                              <button onClick={handleUpdateUserRole}>Save</button>
                              <button
                                onClick={() => {
                                  setEditingUserId(null);
                                  setNewRole("");
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUserId(user.id);
                                setNewRole(user.role || "user");
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* BOOKINGS VIEW */}
        {activeMenu === "bookings" && (
          <div>
            <h2>All Bookings ({bookings.length})</h2>
            <input
              type="text"
              className="search-input"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User Email</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.userEmail || "Unknown"}</td>
                        <td>{booking.name || "N/A"}</td>
                        <td>
                          {editingBookingId === booking.id ? (
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span
                              className={`status-badge ${
                                booking.status?.toLowerCase() || "pending"
                              }`}
                            >
                              {booking.status || "Pending"}
                            </span>
                          )}
                        </td>
                        <td>
                          {editingBookingId === booking.id ? (
                            <>
                              <button onClick={handleUpdateStatus}>Save</button>
                              <button
                                onClick={() => {
                                  setEditingBookingId(null);
                                  setNewStatus("");
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingBookingId(booking.id);
                                  setNewStatus(booking.status || "Pending");
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        No bookings available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="center-btn">
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
