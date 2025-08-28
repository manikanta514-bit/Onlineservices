import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const Home = () => {
  const cardStyleCleaning = { backgroundImage: 'url("/images/Cleaning.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
  const cardStyleRepairs = { backgroundImage: 'url("/images/Repairs.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
  const cardStyleInstallations = { backgroundImage: 'url("/images/Installations2.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
  const cardStylePainting = { backgroundImage: 'url("/images/Texture paint specialized paint1.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
  const cardStylePackersMovers = { backgroundImage: 'url("/images/fragile tems1.png")', backgroundSize: 'cover', backgroundPosition: 'center' };

  return (
    <main className="main-content">
      {/* Hero Section */}
      <div className="hero-section center-text">
        <h1>Welcome to Online Services</h1>
        <h3>Professional Services, Just a Click Away.</h3>
        <p>
          Welcome to <strong>Online Services</strong>, where managing your home and office is finally stress-free.  
          We believe you deserve more time for what truly matters. That's why we connect you with a network of vetted, 
          top-tier professionals for all your cleaning, repair, and installation needs.
        </p>
        <p>
          Our mission is simple: to bring reliability, safety, and comfort into your life with unparalleled convenience. 
          From a sparkling clean home to a perfectly repaired appliance or a seamless new installation, expert help is now at your fingertips. 
          Experience the new standard of home services—affordable, dependable, and designed for your modern life.
        </p>
      </div>

      {/* Services Intro */}
      <div className="services-intro">
        <h2>Your One-Stop Solution for Home & Office Care</h2>
        <p>
          We've simplified the process of maintaining your space. No more searching for different vendors for different needs. 
          Whether you require a deep clean, a swift repair, or a professional installation, our platform brings trusted experts 
          for every job directly to you. Explore our primary services below.
        </p>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        <div className="service-card" style={cardStyleCleaning}>
          <i className="fas fa-spray-can fa-3x card-icon" style={{ color: "gold" }}></i>
          <h2>Professional Cleaning</h2>
          <p>Step into a home or office that feels fresh, hygienic and truly pristine. Our services create a healthier environment.</p>
          <ul className="service-list">
            <li>Deep Home Cleaning</li>
            <li>Office & Commercial Sanitization</li>
            <li>Kitchen & Bathroom Detailing</li>
            <li>Move-In / Move-Out Cleaning</li>
          </ul>
        </div>
        <div className="service-card" style={cardStyleRepairs}>
          <i className="fas fa-wrench fa-3x card-icon" style={{ color: "gold" }}></i>
          <h2>Expert Repairs</h2>
          <p>Don't let a broken appliance disrupt your day. Our certified technicians provide fast, reliable solutions.</p>
          <ul className="service-list">
            <li>Appliance Repair (AC, Fridge, etc.)</li>
            <li>Plumbing & Leakage Fixes</li>
            <li>Electrical Services</li>
            <li>General Handyman Jobs</li>
          </ul>
        </div>
        <div className="service-card" style={cardStyleInstallations}>
          <i className="fas fa-hammer fa-3x card-icon" style={{ color: "gold" }}></i>
          <h2>Seamless Installations</h2>
          <p>Get your new appliances and furniture set up perfectly and safely.</p>
          <ul className="service-list">
            <li>TV Wall Mounting & Setup</li>
            <li>New Appliance Installation</li>
            <li>Furniture Assembly</li>
            <li>Light Fixture & Fan Installation</li>
          </ul>
        </div>
        <div className="service-card" style={cardStylePainting}>
          <i className="fas fa-paint-roller fa-3x card-icon" style={{ color: "gold" }}></i>
          <h2>Custom Painting</h2>
          <p>Bring your walls to life with vibrant colors and premium finishes.</p>
          <ul className="service-list">
            <li>Interior & Exterior Painting</li>
            <li>Custom Wall Murals</li>
            <li>Waterproof Coatings</li>
            <li>Wood & Metal Painting</li>
          </ul>
        </div>
        <div className="service-card" style={cardStylePackersMovers}>
          <i className="fas fa-truck-moving fa-3x card-icon" style={{ color: "gold" }}></i>
          <h2>Packers & Movers</h2>
          <p>Safe and reliable relocation services for your home or office.</p>
          <ul className="service-list">
            <li>Household Shifting</li>
            <li>Office Relocation</li>
            <li>Local & Long Distance Moves</li>
            <li>Packing, Loading & Unloading</li>
          </ul>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="quote">
              "The cleaning service was exceptional! My apartment in Banjara Hills has never looked better. Professional, on-time, and very thorough. Highly recommended!"
            </p>
            <div className="customer-info">
              <img src="./images/Chocobar.png" alt="Customer Abhiram" />
              <div>
                <h4>Abhiram Y.</h4>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="quote">
              "My AC stopped working during the worst of the summer heat. Their repairman from the Rajahmundry area came within hours and fixed it quickly. Very impressive service."
            </p>
            <div className="customer-info">
              <img src="./images/Professor.png" alt="Customer Harsha S." />
              <div>
                <h4>Harsha S.</h4>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="quote">
              "I used them to assemble all my new furniture after moving to Hitech City. It saved me a whole weekend of stress. The technician was polite and efficient."
            </p>
            <div className="customer-info">
              <img src="./images/Bmw.jpg" alt="Customer Manikanta V." />
              <div>
                <h4>Manikanta V.</h4>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          {/* About Us (Centered) */}
          <div className="footer-section about centered">
            <h2>About Us</h2>
            <p>
              At <strong>Online Services</strong>, we bring convenience to your doorstep by 
              connecting you with <em>trusted professionals</em> for all your daily needs — 
              from cleaning, repair, installation, and painting, to hassle-free relocation.  
            </p>
            <p>
              Our mission is simple: <strong>to make home and office care seamless, 
              affordable, and stress-free</strong>. With a customer-first approach, 
              we ensure quality service, transparent pricing, and reliable support 
              every step of the way.
            </p>
            <p>
              Whether it’s a one-time task or regular maintenance, we are here 
              to help you save time, reduce effort, and live smarter. 
            </p>
          </div>

          {/* Contact + Social */}
          <div className="footer-bottom">
            <div className="footer-section contact">
              <h2>Contact Us</h2>
              <p><FaMapMarkerAlt style={{ color: "gold", marginRight: "8px" }} /> GIET Polytechnic College, Rajahmundry, AP</p>
              <p><FaEnvelope style={{ color: "gold", marginRight: "8px" }} /> onlineservices@giet.com</p>
              <p><FaPhoneAlt style={{ color: "gold", marginRight: "8px" }} /> +91 xxxxxxxxxx</p>
            </div>

            <div className="footer-section social">
              <h2>Follow Us</h2>
              <div className="social-icons">
                <a href="/"><i className="fab fa-facebook-f"></i></a>
                <a href="/"><i className="fab fa-instagram"></i></a>
                <a href="/"><i className="fab fa-github"></i></a>
              </div>
            </div>
          </div>

          <hr className="footer-line" />

          {/* Credits */}
          <div className="credits">
            DESIGNED BY <span className="team-name">TEAM A 295</span> STUDENTS FROM GIET POLYTECHNIC COLLEGE
            <div className="team-members">
              ABHIRAM • HARSHA • MANIKANTA • GOPAL • SANTHOSH • DINESH
            </div>
          </div>

          {/* Copyright */}
          <div className="copyright">
            © {new Date().getFullYear()} Online Services. All Rights Reserved.
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
