import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in...");

    try {
      // Make a POST request to your login API
      const res = await axios.post('http://localhost:3000/bookadd/login', { email, password });
      console.log(res.data); // Log the response data

      // Pass the user data up to the parent component (if necessary)
      onLogin(res.data.user);

      // Store token and user data in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name); 
      localStorage.setItem('userRole', res.data.user.role); 
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Save the user details

      // Navigate to the homepage after successful login
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || 'Login failed'); // Log the error response
      setErrorMessage('Invalid email or password'); // Display an error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>
        {/* Display error message if exists */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        <p className="redirect-text">New to BookStore?
          <Link to="/register" className="register-link"> Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
