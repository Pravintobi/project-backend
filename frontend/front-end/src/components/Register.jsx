import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Register.css'; // Add your custom styles here

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/bookadd/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                setFormData({ name: '', email: '', password: '', role: '' }); // Reset form
            } else {
                toast.error(result.message || 'Failed to register.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred during registration.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-container">
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="librarian">Librarian</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <button type="submit" className="register-button">Sign Up</button>
                </form>
                <p className="redirect-text">Already a member? <a href="/login">Sign In</a></p>
            </div>
        </div>
    );
}

export default Register;
