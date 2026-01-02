import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";




const app= express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy:false
}));



app.get("/",(request, response)=>{
    response.json({message:"Server is running" + process.env.PORT})
})