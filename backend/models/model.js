import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true },
    year: { type: String, required: true },
    status: { type: String, enum: ['available', 'borrowed'], default: 'available' },
    image: { type: String },
    genere:{type:String},
    // Fields related to borrowing
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // User who borrowed the book
    borrowDate: { type: Date, default: null }, // When the book was borrowed
    dueDate: { type: Date, default: null }, // When the book is due
    returnDate: { type: Date, default: null }, // When the book was returned
    lateFee: { type: Number, default: 0 }, // Late fee, if applicable
});

const Book = mongoose.model('Book', bookSchema);

export default Book
