import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import uicon from '../images/icon-user.png'

const Navbar = ({ onLogout }) => {
    const [scrolled, setScrolled] = useState(false); // State to track scroll
    const navigate = useNavigate();
    let userName = localStorage.getItem('userName')
    const handleLogoutClick = () => {
        onLogout(); // Call the logout function passed as prop
        navigate('/login'); // Redirect to login page after logout
    };

    const userRole = localStorage.getItem('userRole');

    // Effect to handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50); // Set to true if scrolled more than 50px
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Cleanup listener on unmount
        };
    }, []);

    return (
        <div className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
            <nav className="navbar">
                <div className="container">
                    <Link className="navbar-brand" to="/">Netflix Books</Link>
                    <ul className="navbar-nav">
                        <li>
                            <NavLink className="nav-item nav-link" to="/" activeClassName="active">
                                Home
                            </NavLink>
                        </li>
                        {userRole === 'admin' || userRole === 'librarian' ? (
                            <li>
                                <NavLink className="nav-item nav-link" to="/book" activeClassName="active">
                                    Manage Books
                                </NavLink>
                            </li>
                        ) : (
                            <li>
                                <NavLink className="nav-item nav-link" to="/mybooks" activeClassName="active">
                                    My Books
                                </NavLink>
                            </li>
                        )}
                        {userRole === 'admin' || userRole === 'librarian' ? (
                            <li>
                                <NavLink className="nav-item nav-link" to="/addbook" activeClassName="active">
                                    Add Books
                                </NavLink>
                            </li>
                        ) : null}
                    </ul>
                    <div className="user-profile">
                        <img
                            src={uicon} // Replace with user's profile picture
                            alt="User Profile"
                            className="user-avatar"
                        />

                        <Link to="/editprofile" className="dropbtn">{userName}</Link>



                        <Link className="dropbtn" onClick={handleLogoutClick}>Logout</Link>


                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
