import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/ConnectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/categroy.route.js";

dotenv.config();

 
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));
console.log(process.env.EMAIL, process.env.EMAIL_PASS);


app.get("/", (req, res) => res.json({ message: "Server is running 🚀" }));
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);

const PORT = process.env.PORT || 8080;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
};
startServer();
