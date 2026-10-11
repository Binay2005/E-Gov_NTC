import express from "express";
import userRouter from "./routes/user.route.js";
import mongoose from "mongoose";

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then((conn) => {console.log(`MongoDB connected: ${conn.connection.host}`)})
.catch((err) => {console.log("MongoDB connection error", err.message)});

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Server is up and running!" });
});

app.use("/api/auth", userRouter);

app.listen(3001, () => {
    console.log("Server is running on port 3001");
})