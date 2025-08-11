import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import { auth } from '../context/firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (name && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError('❌ Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('❌ Password must be at least 6 characters');
        return;
      }

      try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        setLoading(false);
        navigate('/services'); 
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    } else {
      setError('⚠️ All fields are required');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up to Book Services</h2>
        {error && <div className="auth-error">{error}</div>}

        <input 
          className="auth-input" 
          placeholder="Enter Name" 
          value={name} 
          onChange={e => { setName(e.target.value); setError(''); }} 
        />

        <input 
          className="auth-input" 
          type="email"
          placeholder="Enter Email" 
          value={email} 
          onChange={e => { setEmail(e.target.value); setError(''); }} 
        />

        <input 
          className="auth-input" 
          type="password" 
          placeholder="Enter Password" 
          value={password} 
          onChange={e => { setPassword(e.target.value); setError(''); }} 
        />

        <input 
          className="auth-input" 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={e => { setConfirmPassword(e.target.value); setError(''); }} 
        />

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Signing Up...' : 'Submit'}
        </button>
        <button 
          className="auth-btn auth-btn-secondary mt-2" 
          onClick={() => navigate('/')}
          disabled={loading}
        >
          Back to Home
        </button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
