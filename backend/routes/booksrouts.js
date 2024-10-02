import { Router } from 'express';
import bcrypt from 'bcrypt';
import bookModel from '../models/model.js';
import userModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import mongoose, { Schema, model, Types } from 'mongoose';

const { ObjectId } = Types;

const router = Router();
//post
router.post('/add', async (req, res) => {
  try {
    const data = req.body;
    const newBook = new bookModel(data);
    await newBook.save();
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding book" });
  }
});


//get req
router.get("/getbooks", async (req, res) => {
  let books;
  try {
    books = await bookModel.find();
    res.status(200).json({ books })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting book" });
  }
})


//get req by id
router.get("/getbooks/:id", async (req, res) => {
  const { id } = req.params; // Get the book ID from the request parameters

  try {
    // Find the book by its ID
    const book = await bookModel.findById(id);

    // If the book doesn't exist, send a 404 response
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // If the book is found, send it in the response
    res.status(200).json({ book });

  } catch (error) {
    console.error(error);

    // Handle invalid ObjectId or other errors
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    res.status(500).json({ message: "Error getting book" });
  }
});

router.post("/getbooks", async (req, res) => {
  const { userId } = req.body; // Get the userId from the request body

  try {
    // Ensure that userId is cast to a valid ObjectId
    const books = await bookModel.find({ borrower: userId, status: 'borrowed' });

    if (!books.length) {
      return res.status(404).json({ message: "No books found for this user" });
    }

    res.status(200).json({ books });
  } catch (error) {
    console.error("Error in getbooks API:", error);
    res.status(500).json({ message: "Error getting books" });
  }
});


//update by id

router.put("/updatebooks/:id", async (req, res) => {
  const id = req.params.id;

  // Correctly destructure from req.body, not res.body
  const { title, author, ISBN, year, genere, status, image } = req.body;

  try {
    // Find and update the book with the provided data
    let book = await bookModel.findByIdAndUpdate(id, {
      title,
      author,
      ISBN,
      year,
      genere,
      status,
      image
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }



    // Send a success response
    res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating book" });
  }
});


// delete book by id
router.delete("/deletebook/:id", async (req, res) => {
  const id = req.params.id
  try {
    await bookModel.findByIdAndDelete(id).then(() => res.status(200).json({ message: "delete succesfullly" }))
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error delete book" });
  }
})

// Borrow a book API
router.post('/borrow', async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const book = await bookModel.findById(bookId).populate('borrower'); // Populate borrower details

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status !== 'available') {
      return res.status(400).json({ message: 'Book is already borrowed' });
    }

    const user = await userModel.findById(userId).populate('borrowedBooks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has reached their borrowing limit (e.g., 3 books)
    if (user.borrowedBooks.length >= 3) {
      return res.status(400).json({ message: 'Borrowing limit reached. Return a book before borrowing more.' });
    }

    // Set the book status to borrowed and record borrower details
    book.status = 'borrowed';
    book.borrower = userId; // Save the userId
    book.borrowDate = new Date(); // Update borrow date to current date

    // Set due date to 14 days from today
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    book.dueDate = dueDate;

    await book.save();

    // Add book to the user's borrowedBooks list
    user.borrowedBooks.push(bookId);
    await user.save();

    const updatedBook = await bookModel.findById(bookId).populate('borrower');

    res.status(200).json({ message: 'Book borrowed successfully', book: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// return a book API
router.post('/return', async (req, res) => {
  const { userId, bookId } = req.body;

  try {
    const book = await bookModel.findById(bookId).populate('borrower');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is currently borrowed
    if (book.status !== 'borrowed') {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }

    
    // if (String(book.borrower) !== userId) {
    //     return res.status(403).json({ message: 'You are not allowed to return this book' });
    // }

    // Update the book details
    book.status = 'available'; // Change status back to available
    book.borrower = null; // Clear the borrower
    book.borrowDate = null; // Clear the borrow date
    book.dueDate = null; // Clear the due date
    book.returnDate = new Date(); // Set return date to current date

    await book.save();

    res.status(200).json({ message: 'Book returned successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});







// Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if no role is provided
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error); // Log the error to the console
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
//login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Optional: Generate a token for the user (if needed)
    const token = jwt.sign({ id: user._id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });

    // Respond with user data and role
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token // Optional: include token in response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
//get all user
router.get("/users", async (req, res) => {
  let users;
  try {
    users = await userModel.find();
    res.status(200).json({ users })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting users" });
  }
})

//change passs
router.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare current password with the hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Save the updated user document with the new password
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//edit user
router.put('/edit-user/:id', async (req, res) => {
  const { name, password } = req.body;
  const userId = req.params.id;

  try {
      // Find the user by ID
      const user = await userModel.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user details
      if (name) {
          user.name = name; // Update name
      }

      if (password) {
          // Hash the new password before saving
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword; // Update password
      }

      // Save the updated user
      await user.save();

      res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});
export default router;
