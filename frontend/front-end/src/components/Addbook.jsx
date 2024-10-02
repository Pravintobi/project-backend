import React, { useState } from 'react';
import axios from 'axios';
import './Adbook.css'; // Ensure your CSS file is properly linked

const Addbook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const addBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/bookadd/add', {
        title,
        author,
        ISBN: isbn,
        year,
        image,
      });
      console.log(response.data); // Log the response from the backend
      alert(response.data.message); // Show the success message from the backend
      // Clear the input fields after adding the book
      setTitle('');
      setAuthor('');
      setIsbn('');
      setYear('');
      setImage('');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message); // Log the error
      alert("Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='add-book-bg'>
      <div className="add-book-container">
      <form onSubmit={addBook} className="add-book-form">
        <h2>Add New Book</h2>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Author" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="ISBN" 
          value={isbn} 
          onChange={(e) => setIsbn(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Year" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Image URL" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
      
      {/* Optional: Displaying books in a horizontal scrollable list */}
      <div className="book-list">
        {/* You can map over your books array here if you want to show them */}
      </div>
    </div>
    </div>
    
  );
};

export default Addbook;
