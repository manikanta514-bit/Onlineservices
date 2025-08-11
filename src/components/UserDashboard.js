import { useContext, useState } from "react";
import { BookingContext } from "../context/BookingContext";

const UserDashboard = () => {
  const { bookings, clearBookings, user } = useContext(BookingContext);
  console.log("Logged in user:", user);
  const [loading, setLoading] = useState(false);

  const handleClearBookings = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all your bookings? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await clearBookings();
      alert("All bookings deleted successfully.");
    } catch (error) {
      alert("Failed to delete bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-container">
      <h2>User Dashboard</h2>

      {bookings.length > 0 ? (
        <>
          {bookings.map((item, idx) => (
            <div key={item.id || idx} className="activity-card">
              <h3>Booking #{idx + 1}</h3>

              {item.category && (
                <p>
                  <b>Category:</b> {item.category}
                </p>
              )}
              {item.name && (
                <p>
                  <b>Name:</b> {item.name}
                </p>
              )}
              {item.charges && (
                <p>
                  <b>Charges:</b> {item.charges}
                </p>
              )}
              {item.desc && (
                <p>
                  <b>Description:</b> {item.desc}
                </p>
              )}
              {item.skill && (
                <p>
                  <b>Skill:</b> {item.skill}
                </p>
              )}
              {item.exp && (
                <p>
                  <b>Experience:</b> {item.exp}
                </p>
              )}

              <div className="service-footer">Service Booked</div>
            </div>
          ))}

          <button
            className="clear-btn"
            onClick={handleClearBookings}
            disabled={loading}
          >
            {loading ? "Clearing..." : "Clear All Bookings"}
          </button>
        </>
      ) : (
        <p>
          No recent activity yet. Book a service or worker to see your activity
          here.
        </p>
      )}
    </div>
  );
};

export default UserDashboard;
