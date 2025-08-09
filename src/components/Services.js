import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <h1 className="text-center">Our Services</h1>

      <div className="mani-intro">
        <p>
          At <b>Online Services</b>, we go beyond just providing solutions —
          we bring convenience, quality, and trust to your doorstep.
        </p>
        <p>
          Whether you need a sparkling clean home, quick and efficient repairs,
          expert installations, professional painting services, or trusted packers and movers, we've got you covered.
        </p>
        <p>
          Join thousands of satisfied customers who trust us. Book a service today!
        </p>
        <div className="mani-cta">
          <h2>Click the service you want to choose</h2>
          <p>Select Cleaning, Repair, Installation, Painting, or Packers and Movers services easily.</p>
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

        <div className="mani-box" onClick={() => navigate("/painting")}>
          <i className="fas fa-paint-roller fa-3x text-orange-600"></i>
          <h3>Painting</h3>
          <p>Professional interior and exterior painting for homes and offices.</p>
        </div>

        {/* New Packers and Movers service box */}
        <div className="mani-box" onClick={() => navigate("/packersmovers")}>
          <i className="fas fa-truck-moving fa-3x text-orange-600"></i>
          <h3>Packers and Movers</h3>
          <p>Trusted packing, moving, and relocation services for homes, offices, and vehicles.</p>
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
