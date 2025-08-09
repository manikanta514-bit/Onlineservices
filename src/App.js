import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Cleaning from './components/Cleaning';
import Repairs from './components/Repairs';
import Installations from './components/Installations';
import Services from './components/Services';
import Help from './components/Help';
import About from './components/About';
import Signup from './components/Signup';
import Login from './components/Login';
import Settings from './components/Settings';
import Contractors from './components/Contractors';
import Painting from './components/Painting';
import PackersMovers from './components/PackersMovers';
import { BookingProvider } from './context/BookingContext';
import UserDashboard from './components/UserDashboard';

// ------------------- Header -------------------
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="main-header">
      <div className="header-content">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
        <Link to="/" className="logo-link">
          <div className="logo">ONLINE SERVICES</div>
        </Link>
        <div className="nav-right">
          <Link to="/login" className="nav-button login-btn">Login</Link>
          <Link to="/signup" className="nav-button signup-btn">Sign Up</Link>
        </div>
      </div>
      {menuOpen && (
        <div className="hamburger-menu">
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link><hr />
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link><hr />
          <Link to="/help" onClick={() => setMenuOpen(false)}>Help</Link><hr />
          <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link><hr />
          <Link to="/contractors" onClick={() => setMenuOpen(false)}>Contractors</Link><hr />
          <Link to="/userdashboard" onClick={() => setMenuOpen(false)}>UserDashboard</Link><hr />
        </div>
      )}
    </header>
  );
};

// ------------------- Home -------------------
const Home = () => {
  const cardStyleCleaning = { backgroundImage: 'url("/images/Cleaning.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
  const cardStyleRepairs = { backgroundImage: 'url("/images/Repairs.png")', backgroundSize: 'cover', backgroundPosition: 'center' };
  const cardStyleInstallations = { backgroundImage: 'url("/images/Installations2.png")', backgroundSize: 'cover', backgroundPosition: 'center' };

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

      {/* Services Section */}
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
      </div>

      {/* Testimonials Section */}
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
    </main>
  );
};

// ------------------- App -------------------
const App = () => {
  return (
    <div className="App-css">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cleaning" element={<Cleaning />} />
        <Route path="/repairs" element={<Repairs />} />
        <Route path="/installations" element={<Installations />} />
        <Route path="/painting" element={<Painting />} />
        <Route path="/packersmovers" element={<PackersMovers />} />
        <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contractors" element={<Contractors />} />       
        <Route path="/userdashboard" element={<UserDashboard />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

const MainApp = () => (
  <Router>
    <BookingProvider>
      <App />
    </BookingProvider>
  </Router>
);

export default MainApp;
