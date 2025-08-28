import { Link } from "react-router-dom";
import { workersData } from "./workersData";
import { FaStar } from "react-icons/fa"; // for stars

const Contractors = () => {
  return (
    <div className="guys-detail">
      <h1>Our Skilled Contractors</h1>
      <p>
        Browse our professional contractors across various categories. Click on a contractor to view more details and reviews.
      </p>

      {Object.entries(workersData).map(([category, workers]) => (
        <div key={category} className="category-section">
          <h3 className="category-title">{category}</h3>

          <div className="guys-grid">
            {workers.map((worker) => (
              <div key={worker.id} className="guys-card">
                <div className="logo-container">
                  <img src={worker.img} alt={worker.name} className="service-logo" />
                </div>

                <div className="card-info" style={{ flexGrow: 1 }}>
                  <h3>{worker.name}</h3>
                  <p><b>Skill:</b> {worker.skill}</p>
                  <p><b>Experience:</b> {worker.exp}</p>
                  <p className="guys-price"><b>Charges:</b> {worker.charges}</p>

                  {/* Star Rating */}
                  <p className="star-rating">
                    <b>Rating:</b>{" "}
                    {[...Array(Math.round(worker.rating || 0))].map((_, i) => (
                      <FaStar key={i} style={{ color: "gold" }} />
                    ))}
                    {worker.rating ? ` ${worker.rating}/5` : " N/A"}
                  </p>

                  <p><b>Reviews:</b> {worker.reviews?.length || 0}</p>
                </div>

                <Link to={`/contractors/${worker.id}`} className="guys-btn">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contractors;
