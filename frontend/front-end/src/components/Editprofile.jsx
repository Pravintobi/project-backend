import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './editprofile.css'

const Editprofile = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId'); // Get user ID from local storage

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://localhost:3000/bookadd/edit-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Profile updated successfully!');
                // Optionally redirect or update local storage here
            } else {
                setMessage(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to update profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-container">
            <div className="edit-profile-container">
                <h1 className="edit-profile-title">Edit Profile</h1>
                {message && <p className="message">{message}</p>}
                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>
                    <button type="submit" className="edit-profile-btn" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Editprofile;
