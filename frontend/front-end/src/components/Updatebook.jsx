import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UpdateBook.css'; // Assuming you have a CSS file for styling

function UpdateBook() {
  const { bookId } = useParams(); // Retrieve the bookId from the URL parameters
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    ISBN: '',
    year: '',
    genere: '',
    status: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch book details by ID from the API and populate the state
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/bookadd/getbooks/${bookId}`);
        const result = await response.json();

        if (response.ok) {
          setBookDetails({
            title: result.book.title,
            author: result.book.author,
            ISBN: result.book.ISBN,
            year: result.book.year,
            genere: result.book.genere,
            status: result.book.status,
            image: result.book.image,
          });
        } else {
          toast.error('Failed to fetch book details.');
        }
      } catch (error) {
        toast.error('Error fetching book details.');
      }
    };

    fetchBookDetails();
  }, [bookId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission for updating the book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/bookadd/updatebooks/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookDetails), // Send the updated book details in the request body
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Book updated successfully.');
        navigate('/'); // Redirect to the main page after a successful update
      } else {
        toast.error(`Failed to update book: ${result.message}`);
      }
    } catch (error) {
      toast.error('Error updating the book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-book-card">
      <div className="form-card">
        <h1 className="text-center">Update Book</h1>
        <form onSubmit={handleSubmit} className="update-book-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={bookDetails.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={bookDetails.author}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="ISBN"
              value={bookDetails.ISBN}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={bookDetails.year}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Genere</label>
            <input
              type="text"
              name="genere"
              value={bookDetails.genere}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={bookDetails.status}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={bookDetails.image}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Book'}
          </button>
        </form>
      </div>

      <div className="image-card">
        <img src={bookDetails.image} alt={bookDetails.title} className="book-image" />
      </div>
    </div>
  );
}

export default UpdateBook;
