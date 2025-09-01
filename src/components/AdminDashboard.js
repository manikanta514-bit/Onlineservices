import React, { useState, useEffect, useMemo, useContext } from "react";
import { db } from "../context/firebase";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { FaBars, FaTimes, FaUser, FaBook, FaImage } from "react-icons/fa";
import "../App.css";

const CLOUDINARY_UPLOAD_PRESET = "before_after_upload";
const CLOUDINARY_CLOUD_NAME = "dloxtchyy";
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenu, setActiveMenu] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [contractors, setContractors] = useState([]);

  const navigate = useNavigate();
  const { updateBookingStatus } = useContext(BookingContext);

  // ================= FETCH USERS =================
  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH BOOKINGS =================
  useEffect(() => {
    setLoading(true);
    const bookingsRef = collection(db, "bookings");
    const unsubscribe = onSnapshot(bookingsRef, async (snapshot) => {
      const fetchedBookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      for (const booking of fetchedBookings) {
        if (!booking.beforeAfter) {
          const bookingRef = doc(db, "bookings", booking.id);
          await updateDoc(bookingRef, { beforeAfter: { before: "", after: "" } });
          booking.beforeAfter = { before: "", after: "" };
        }
      }

      setBookings(fetchedBookings);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH CONTRACTORS =================
  useEffect(() => {
    const contractorsRef = collection(db, "contractors");
    const unsubscribe = onSnapshot(contractorsRef, (snapshot) => {
      setContractors(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ================= FILTER BOOKINGS =================
  const filteredBookings = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return bookings.filter(
      (b) =>
        b.name?.toLowerCase().includes(search) ||
        b.userEmail?.toLowerCase().includes(search) ||
        b.status?.toLowerCase().includes(search)
    );
  }, [bookings, searchTerm]);

  // ================= DELETE BOOKING =================
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE BOOKING STATUS =================
  const handleUpdateStatus = async () => {
    if (!editingBookingId || !newStatus) return;
    try {
      const booking = bookings.find((b) => b.id === editingBookingId);
      if (!booking) return;
      await updateBookingStatus(editingBookingId, booking.userId, newStatus);
      setEditingBookingId(null);
      setNewStatus("");
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status.");
    }
  };

  // ================= UPDATE USER ROLE =================
  const handleUpdateUserRole = async () => {
    if (!editingUserId || !newRole) return;
    try {
      await updateDoc(doc(db, "users", editingUserId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUserId ? { ...u, role: newRole } : u))
      );
      setEditingUserId(null);
      setNewRole("");
    } catch (err) {
      console.error(err);
      alert("Failed to update role.");
    }
  };

  // ================= CLOUDINARY UPLOAD =================
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "before_after");

    const response = await fetch(CLOUDINARY_API_URL, { method: "POST", body: formData });
    const data = await response.json();
    return data.secure_url;
  };

  // ================= UPDATED HANDLE UPLOAD IMAGE =================
  const handleUploadImage = async (type) => {
    if (!selectedContractorId) return alert("Select a contractor first");
    const file = type === "before" ? beforeFile : afterFile;
    if (!file) return alert(`Select ${type} image`);

    try {
      const url = await uploadToCloudinary(file);

      // 1️⃣ Update contractor document
      const contractorRef = doc(db, "contractors", selectedContractorId);
      const contractorDoc = contractors.find(c => c.id === selectedContractorId);
      const updatedBeforeAfter = {
        ...(contractorDoc?.beforeafter || {}),
        [type]: url
      };
      await updateDoc(contractorRef, { beforeafter: updatedBeforeAfter });

      // 2️⃣ Update all bookings for this contractor
      const bookingsToUpdate = bookings.filter(b => b.contractorDetails?.id === selectedContractorId);
      for (const b of bookingsToUpdate) {
        const bookingRef = doc(db, "bookings", b.id);
        const newBeforeAfter = { ...b.beforeAfter, [type]: url };
        await updateDoc(bookingRef, { beforeAfter: newBeforeAfter });
        b.beforeAfter[type] = url;
      }

      // 3️⃣ Update users collection for bookings of this contractor
      for (const b of bookingsToUpdate) {
        if (b.userId) {
          const userRef = doc(db, "users", b.userId);
          // Using dynamic field path so only the specific booking's beforeAfter is updated
          await updateDoc(userRef, { [`bookings.${b.id}.beforeAfter.${type}`]: url });
        }
      }

      // 4️⃣ Reset file input
      type === "before" ? setBeforeFile(null) : setAfterFile(null);
      setBookings([...bookings]);

      alert(`${type} image uploaded for contractor, bookings, and users!`);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, try again.");
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
          <li className={activeMenu === "users" ? "active" : ""} onClick={() => setActiveMenu("users")}>
            <FaUser className="icon" /> {sidebarOpen && "Users"}
          </li>
          <li className={activeMenu === "bookings" ? "active" : ""} onClick={() => setActiveMenu("bookings")}>
            <FaBook className="icon" /> {sidebarOpen && "Bookings"}
          </li>
          <li className={activeMenu === "beforeafter" ? "active" : ""} onClick={() => setActiveMenu("beforeafter")}>
            <FaImage className="icon" /> {sidebarOpen && "Before/After Images"}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`dashboard-content ${sidebarOpen ? "expanded" : "collapsed"}`}>
        <h1>Admin Dashboard</h1>

        {/* USERS VIEW */}
        {activeMenu === "users" && (
          <div className="table-container">
            <h2>All Users ({users.length})</h2>
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
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email || "No Email"}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        user.role || "user"
                      )}
                    </td>
                    <td>
                      {editingUserId === user.id ? (
                        <>
                          <button onClick={handleUpdateUserRole}>Save</button>
                          <button onClick={() => { setEditingUserId(null); setNewRole(""); }}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => { setEditingUserId(user.id); setNewRole(user.role || "user"); }}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BOOKINGS VIEW */}
        {activeMenu === "bookings" && (
          <div className="table-container">
            <h2>All Bookings ({bookings.length})</h2>
            <input type="text" className="input-admin" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.userEmail || "Unknown"}</td>
                    <td>{booking.name || "N/A"}</td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : booking.status || "Pending"}
                    </td>
                    <td>
                      {editingBookingId === booking.id ? (
                        <>
                          <button onClick={handleUpdateStatus}>Save</button>
                          <button onClick={() => setEditingBookingId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingBookingId(booking.id); setNewStatus(booking.status || "Pending"); }}>Edit</button>
                          <button onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BEFORE/AFTER IMAGES VIEW */}
        {activeMenu === "beforeafter" && (
          <div className="upload-section">
            <h2>Before/After Images</h2>
            <label>Select Contractor:</label>
            <select value={selectedContractorId} onChange={(e) => setSelectedContractorId(e.target.value)} className="input-admin">
              <option value="">--Select Contractor--</option>
              {Object.entries(
                contractors.reduce((groups, contractor) => {
                  const cat = contractor.category || "Uncategorized";
                  if (!groups[cat]) groups[cat] = [];
                  groups[cat].push(contractor);
                  return groups;
                }, {})
              ).map(([category, contractorsInCategory]) => (
                <optgroup key={category} label={category}>
                  {contractorsInCategory.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div>
              <h3>Before Image</h3>
              <input type="file" onChange={(e) => setBeforeFile(e.target.files[0])} />
              <button onClick={() => handleUploadImage("before")}>Upload Before</button>

              <h3>After Image</h3>
              <input type="file" onChange={(e) => setAfterFile(e.target.files[0])} />
              <button onClick={() => handleUploadImage("after")}>Upload After</button>
            </div>

            <h3>Existing Images</h3>
            {selectedContractorId && (
              <div className="image-gallery">
                {bookings
                  .filter((b) => b.contractorDetails?.id === selectedContractorId)
                  .map((b) => (
                    <div key={b.id}>
                      <strong>{b.contractorDetails?.name || b.name}</strong>
                      <div>
                        <h4>Before</h4>
                        {b.beforeAfter?.before && <img src={b.beforeAfter.before} width={100} alt="Before" />}
                      </div>
                      <div>
                        <h4>After</h4>
                        {b.beforeAfter?.after && <img src={b.beforeAfter.after} width={100} alt="After" />}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <div className="center-btn">
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
