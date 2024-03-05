import express from "express";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
dotenv.config();

const app = express();

// Allow requests from both frontend URLs
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://bookshop.eastus.cloudapp.azure.com"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // You may need this for cookies to work
}));
app.use(express.json());
app.use(router);
 
app.listen(5050, () => console.log('Server running at port 5050'));
