import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
const UserDashboard = () => {
  const { bookings, clearBookings } = useContext(BookingContext);
  return (
    <div className="activity-container">
      <h2>User Dashboard</h2>
      {bookings.length > 0 ? (
        <>
          {bookings.map((item, index) => (
            <div key={index} className="activity-card">
              <h3>Booking #{index + 1}</h3>
              
              {item.category && (
                <p><b>Category:</b> {item.category}</p>
              )}
              <p><b>Name:</b> {item.name}</p>
              <p><b>Charges:</b> {item.charges}</p>

              {item.desc && (
                <p><b>Description:</b> {item.desc}</p>
              )}
              {item.skill && (
                <p><b>Skill:</b> {item.skill}</p>
              )}
              {item.exp && (
                <p><b>Experience:</b> {item.exp}</p>
              )}

              <div className="service-footer">
                Service Booked
              </div>
            </div>
          ))}
          <button className="clear-btn" onClick={clearBookings}>Clear All Bookings</button>
        </>
      ) : (
        <p>No recent activity yet. Book a service or worker to see your activity here.</p>
      )}
    </div>
  );
};

export default UserDashboard;
