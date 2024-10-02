import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Book from './components/Book';
import Addbook from './components/Addbook';
import Login from './components/Login';
import Mybooks from './components/Mybooks';
import Register from './components/Register';
import UpdateBook from './components/Updatebook';
import EditProfile from './components/Editprofile';

function App() {
  // Check local storage for userId on initial render
  const [user, setUser] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? { id: storedUserId } : null; // Adjust according to your user structure
  });

  const handleLogout = () => {
    setUser(null); // Clear user state
    localStorage.clear(); // Clear localStorage
  };

  const handleLogin = (userData) => {
    setUser(userData); // Set the user data after login
    localStorage.setItem('userId', userData.id); // Store userId in localStorage
  };

  return (
    <Router>
      {!user ? (
        <Routes>
          {/* Show the login and register pages if the user is not logged in */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} /> {/* Redirect any unknown paths to Login */}
        </Routes>
      ) : (
        <>
          {/* Navbar is only shown when the user is logged in */}
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mybooks" element={<Mybooks />} />
            <Route path="/book" element={<Book />} />
            <Route path="/addbook" element={<Addbook />} />
            <Route path="/update/:bookId" element={<UpdateBook />} />
            <Route path="/editprofile" element={<EditProfile />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
