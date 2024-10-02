import React, { useState } from 'react';
import './MybookSection.css';
import { toast } from 'react-toastify';

function MybookSection({ data }) {
    const [books, setBooks] = useState(data);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingBookId, setLoadingBookId] = useState(null);

    const onReturn = async (bookId) => {
        setLoadingBookId(bookId);
        let user_id = localStorage.getItem('userId');
        const userId = user_id;

        try {
            const response = await fetch('http://localhost:3000/bookadd/return', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, bookId }),
            });

            const result = await response.json();

            if (response.ok) {
                setBooks(books.map((book) =>
                    book._id === bookId ? { ...result.book, status: 'available' } : book
                ));
                toast.success(result.message);
            } else {
                // Show alert message if borrowing limit is reached or other errors occur
                if (result.message.includes('limit')) {
                    toast.warning('You have reached your borrowing limit. Please return a book before borrowing more.');
                } else {
                    toast.error(`Failed to return the book: ${result.message || 'Unknown error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to return the book. Please try again later.');
        } finally {
            setLoadingBookId(null);
        }
    };

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="my-books-container">
            <h1 className="my-books-title text-center">My Book Collection</h1>

            {/* Search Input */}
            <div className="my-books-search mb-4">
                <input
                    type="text"
                    className="form-control my-books-search-input"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="my-books-grid">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book, index) => (
                        <div key={index} className="my-books-card">
                            <img
                                src={book.image}
                                alt={`Cover of ${book.title}`}
                                className="my-books-card-img"
                            />
                            <button
                                onClick={() => onReturn(book._id)}
                                className="my-books-btn btn"
                                disabled={loadingBookId === book._id}
                            >
                                {loadingBookId === book._id ? 'Returning...' : 'Return'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="my-books-no-books text-center text-white">
                        No books found matching the search query.
                    </div>
                )}
            </div>
        </div>
    );
}

export default MybookSection;
