import React from 'react';
import landing from '../images/hero2.webp';
import ebookImage from '../images/ebook.png';
import { Link } from "react-router-dom";
import './home.css';

function Home() {
  return (
    <>
      <section id="mu-hero" className='container-fluid' style={{ backgroundImage: `url(${landing})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', position: 'relative' }}>
       
        <div className='row h-100'>
          <div className='col-md-6 col-sm-6'>
            <div className="mu-hero-left" style={{ color: 'white', zIndex: 1, padding: '50px',marginTop:'90px' }}>
              <h1 className="display-4 font-weight-bold">Your Journey Through Literature Begins Here</h1>
              <p>"From fiction to non-fiction, dive into a vast selection of genres and uncover stories that resonate with you."</p>
              <Link to="/book" className="mu-primary-btn my-3">View Books</Link>
            </div>
          </div>
          <div className='col-md-6 col-sm-6 d-flex justify-content-center align-items-center'>
            <div className="mu-hero-right">
              <img src={ebookImage} alt="Ebook" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* New Section for Book Collections */}
      <section className="book-collections py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center mb-4">Explore Our Collections</h2>
          <p className="text-center">Discover a diverse range of books across various genres. Whether you're looking for the latest bestsellers or timeless classics, we have something for everyone!</p>
          <div className="row">
            <div className="col-md-4 text-center">
              <h3>Fiction</h3>
              <p>Immerse yourself in captivating stories that will take you to different worlds.</p>
            </div>
            <div className="col-md-4 text-center">
              <h3>Non-Fiction</h3>
              <p>Learn from real-life experiences and expert insights on various topics.</p>
            </div>
            <div className="col-md-4 text-center">
              <h3>Children's Books</h3>
              <p>Delight young readers with enchanting tales and colorful illustrations.</p>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/book" className="mu-primary-btn">View All Collections</Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer py-4" style={{ backgroundColor: '#343a40', color: 'white' }}>
        <div className="container text-center">
          <p>&copy; 2024 Your Bookstore. All rights reserved.</p>
          <p>Follow us on social media: 
            <a href="#" className="text-white"> Facebook</a> | 
            <a href="#" className="text-white"> Twitter</a> | 
            <a href="#" className="text-white"> Instagram</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Home;
