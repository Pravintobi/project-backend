import express from 'express';
import bookRoute from "./routes/booksrouts.js"
import cors from "cors"
import './connection/connection.js'; // Also add `.js` here

const app = express();
app.use(express.json())
app.use(cors())
app.use("/bookadd", bookRoute);

app.listen(3000, () => {
    console.log("Server connected");
});
