import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookSection from './BookSection';
import './booksection.css'; // Make sure to include the CSS file

const Book = () => {
  const [Data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchBooks = async () => {
      // Delay loading state by 3 seconds
      setTimeout(async () => {
        try {
          const res = await axios.get("http://localhost:3000/bookadd/getbooks");
          setData(res.data.books); // Assuming response contains a `books` array
        } catch (error) {
          console.error("Failed to fetch books:", error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching data
        }
      }, 2000); // 3 seconds delay
    };

    fetchBooks();
  }, []); // Empty array means this will only run once when the component mounts

  return (
    <div className='bg-dark' style={{ minHeight: '91.5vh', position: 'relative' }}>
      <div className='container py-3'>
        <div className='justify-content-center align-items-center'>
          <div className='d-flex justify-content-start align-items-start'>
            {isLoading ? (
              <div className='loading-spinner'>
                <img src="https://i.pinimg.com/originals/b9/1e/11/b91e1131ca20f6369aa68d21cb3a8960.gif" alt="Loading..." />
              </div>
            ) : (
              Data ? (
                <BookSection data={Data} />
              ) : (
                <div className='text-white'>No books found.</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
);

};

export default Book;
