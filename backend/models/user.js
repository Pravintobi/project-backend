import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'librarian', 'admin'], default: 'user' },

    // Track borrowed books
    borrowedBooks: [{
        book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        borrowDate: { type: Date },
        dueDate: { type: Date },
    }],

    borrowLimit: { type: Number, default: 3 }, // Set the borrowing limit for the user
});

const User = mongoose.model('User', userSchema);
export default User;
