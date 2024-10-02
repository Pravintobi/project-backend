import mongoose from 'mongoose';

mongoose
  .connect("mongodb+srv://apravin1922:Tobi1922@cluster0.ts16b.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));
