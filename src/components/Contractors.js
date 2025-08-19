import React from "react";
import { Link } from "react-router-dom";
import workersData from "./workersData";

const Contractors = () => {
  return (
    <div className="workers-container">
      <h2>Our Skilled Contractors</h2>
      {Object.entries(workersData).map(([category, workers]) => (
        <div key={category} className="category-section">
          <h3>{category}</h3>
          <div className="workers-grid">
            {workers.map((worker) => (
              <div key={worker.id} className="worker-card">
                <img src={worker.img} alt={worker.name} className="worker-img" />
                <h4>{worker.name}</h4>
                <p><b>Skill:</b> {worker.skill}</p>
                <p><b>Experience:</b> {worker.exp}</p>
                <p><b>Charges:</b> {worker.charges}</p>
                <p><b>Rating:</b> ⭐ {worker.rating}</p>
                <p><b>Reviews:</b> {worker.reviews?.slice(0, 2).join(", ")}</p>

                {/* Link to ContractorPage */}
                <Link
                  to={`/contractor/${worker.id}`}
                  className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 inline-block"
                >
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
