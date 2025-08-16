import React, { useState, useEffect, useContext } from 'react';
import { db } from '../context/firebase'; 
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';

const AdminDashboard = () => {
    const { bookings: userBookings } = useContext(BookingContext); // listen to BookingContext for real-time updates
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [editingBooking, setEditingBooking] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // Fetch users once
    useEffect(() => {
        const usersRef = collection(db, "users");
        const unsubscribe = onSnapshot(usersRef, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
            console.error("Error fetching users: ", error);
        });
        return () => unsubscribe();
    }, []);

    // Real-time bookings listener
    useEffect(() => {
        setLoading(true);
        const bookingsRef = collection(db, "bookings");
        const unsubscribe = onSnapshot(bookingsRef, (snapshot) => {
            setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching bookings: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Keep bookings in sync with BookingContext
    useEffect(() => {
        setBookings(userBookings);
    }, [userBookings]);

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to permanently delete this booking?")) {
            try {
                await deleteDoc(doc(db, "bookings", bookingId));
                setBookings(prev => prev.filter(b => b.id !== bookingId)); // local update
            } catch (error) {
                console.error("Error deleting booking: ", error);
            }
        }
    };

    const handleEditClick = (booking) => {
        setEditingBooking(booking);
        setNewStatus(booking.status || "Pending"); 
    };

    const handleUpdateStatus = async () => {
        if (!editingBooking || !newStatus.trim()) return;

        try {
            const bookingRef = doc(db, "bookings", editingBooking.id);
            await updateDoc(bookingRef, { status: newStatus });
            setEditingBooking(null);
            setNewStatus("");
        } catch (error) {
            console.error("Error updating booking status: ", error);
        }
    };

    if (loading) {
        return <h1>Loading Dashboard...</h1>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <h2>All Users ({users.length})</h2>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.role || 'user'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>All Bookings ({bookings.length})</h2>
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
                    {bookings.length > 0 ? bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.userEmail}</td>
                            <td>{booking.name}</td>
                            <td>
                                {editingBooking && editingBooking.id === booking.id ? (
                                    <input 
                                        type="text" 
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="status-input"
                                    />
                                ) : (
                                    booking.status || "Pending"
                                )}
                            </td>
                            <td>
                                <div className="admin-actions">
                                    {editingBooking && editingBooking.id === booking.id ? (
                                        <>
                                            <button className="edit-btn" onClick={handleUpdateStatus}>Save</button>
                                            <button className="delete-btn" onClick={() => setEditingBooking(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="edit-btn" onClick={() => handleEditClick(booking)}>Edit Status</button>
                                            <button className="delete-btn" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center", fontStyle: "italic" }}>
                                No bookings available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                <button className="back-home-btn" onClick={() => navigate("/")}>
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
