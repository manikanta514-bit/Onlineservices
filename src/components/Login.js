import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../context/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('⚠️ Please fill in both fields');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(' Login successful!');
      navigate('/services');  
    } catch (err) {
      console.error("Firebase login error:", err.code, err.message);

      if (err.code === "auth/user-not-found") {
        setError("❌ No account found. Redirecting to Signup...");
        setTimeout(() => navigate('/signup'), 2000);
      } else if (err.code === "auth/invalid-email") {
        setError("❌ Invalid email format");
      } else if (err.code === "auth/wrong-password") {
        setError("❌ Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("⚠️ Too many attempts. Please try again later.");
      } else {
        setError("❌ You do not have an account. Redirecting to Signup...");
        setTimeout(() => navigate('/signup'), 2000);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login to Book Services</h2>
        {error && <div className="auth-error">{error}</div>}

        <input
          className="auth-input"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleLogin}>
          Submit
        </button>
        <button
          className="auth-btn auth-btn-secondary mt-2"
          onClick={() => navigate('/')}  // NEW: back to home
        >
          Back to Home
        </button>

        <p className="text-center mt-3">
          Don't have an account? <a href="/signup" className="auth-link">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
