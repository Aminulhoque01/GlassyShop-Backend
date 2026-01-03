import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/ConnectDB.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀" });
});

const PORT = process.env.PORT || 8080;

// start server AFTER db connected
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
  }
};

startServer();
