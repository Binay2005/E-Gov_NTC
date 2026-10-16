import express from "express";
import userRouter from "./routes/user.route.js";
import mongoose from "mongoose";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then((conn) => {console.log(`MongoDB connected: ${conn.connection.host}`)})
.catch((err) => {console.log("MongoDB connection error", err.message)});

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/index.html"));
});

app.use("/api/auth", userRouter);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})