import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './booksection.css';

function BookSection({ data }) {
    const [books, setBooks] = useState(data);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loadingBookId, setLoadingBookId] = useState(null);
    const userRole = localStorage.getItem('userRole');
    const navigate = useNavigate();

    const genres = ["All", "Fiction", "Non-Fiction", "Children's Books"]; // Add your genres here

    const onBorrow = async (bookId) => {
        setLoadingBookId(bookId);
        let user_id = localStorage.getItem('userId');
        const userId = user_id;

        try {
            const response = await fetch('http://localhost:3000/bookadd/borrow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, bookId }),
            });

            const result = await response.json();

            if (response.ok) {
                setBooks(books.map((book) =>
                    book._id === bookId ? { ...book, status: 'borrowed' } : book
                ));
                toast.success(result.message);
            } else {
                toast.error(`Failed to borrow the book: ${result.message || 'Unknown error occurred.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to borrow the book. Please try again later.');
        } finally {
            setLoadingBookId(null);
        }
    };

    const onDelete = async (bookId) => {
        setLoadingBookId(bookId);
        try {
            const response = await fetch(`http://localhost:3000/bookadd/deletebook/${bookId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (response.ok) {
                setBooks(books.filter((book) => book._id !== bookId));
                toast.success(result.message);
            } else {
                toast.error(`Failed to delete the book: ${result.message || 'Unknown error occurred.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to delete the book. Please try again later.');
        } finally {
            setLoadingBookId(null);
        }
    };

    const onUpdate = (bookId) => {
        navigate(`/update/${bookId}`);
    };

    // Filter logic
    const filteredBooks = books.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === "All" || selectedGenre === "" || book.genere === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    return (
        <div className="container py-5">
            <h1 className="text-center">Books Collection</h1>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Genre Tabs */}
            <div className="genre-tabs mb-4">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        className={`tab-button ${selectedGenre === genre ? 'active' : ''}`}
                        onClick={() => setSelectedGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="book-row">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book, index) => (
                        <div key={index} className="book-card">
                            <img
                                src={book.image}
                                alt={`Cover of ${book.title}`}
                                className="card-img-top"
                            />
                            <div className="book-overlay">
                                <h5 className="card-title">{book.title}</h5>
                                <p className="card-text">
                                    <strong>Author:</strong> {book.author} <br />
                                    <strong>ISBN:</strong> {book.ISBN} <br />
                                    <strong>Year:</strong> {book.year} <br />
                                    <strong>Status:</strong> {book.status} <br />
                                </p>
                                <div className="card-footer">
                                    {book.status === 'available' ? (
                                        userRole === 'admin' || userRole === 'librarian' ? (
                                            <div>
                                                <button
                                                    onClick={() => onUpdate(book._id)}
                                                    className="btn btn-warning"
                                                    disabled={loadingBookId === book._id}
                                                >
                                                    {loadingBookId === book._id ? 'Updating...' : 'Update'}
                                                </button>
                                                <button
                                                    onClick={() => onDelete(book._id)}
                                                    className="btn btn-danger"
                                                    disabled={loadingBookId === book._id}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onBorrow(book._id)}
                                                className="btn btn-primary"
                                                disabled={loadingBookId === book._id}
                                            >
                                                {loadingBookId === book._id ? 'Borrowing...' : 'Borrow'}
                                            </button>
                                        )
                                    ) : (
                                        <button disabled className="btn btn-secondary">Borrowed</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">No books found matching the search query.</div>
                )}
            </div>
        </div>
    );
}

export default BookSection;
