import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MybookSection from './Mybooksection';


const Mybooks = () => {
  const [Data, setData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userId');;
  useEffect(() => {
    const fetchBooks = async () => {
      setTimeout(async () => {
        try {
          const response = await axios.post('http://localhost:3000/bookadd/getbooks', { userId });
          setData(response.data.books);
        } catch (error) {
          console.error('Error fetching books:', error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching data
        }
      }, 2000);
    };

    fetchBooks();
  }, []); // Empty array means this will only run once when the component mounts

  return (
    <div className='bg-dark' style={{ minHeight: '91.5vh' }}>
      <div className='container py-3'>
        <div className=' justify-content-center align-items-center'>
          {/* Heading at the top, aligned to the left */}


          {/* Books Section or Loading message */}
          <div className='d-flex justify-content-start align-items-start'>
            {isLoading ? (
              <div className='loading-spinner'>
                <img src="https://i.pinimg.com/originals/b9/1e/11/b91e1131ca20f6369aa68d21cb3a8960.gif" alt="Loading..." />
              </div>
            ) : (
              Data ? (
                <MybookSection data={Data} />
              ) : (
                <div className="no-books-container">
                  <div className="no-books">No Books are here</div>
                </div>

              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mybooks;
