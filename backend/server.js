import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
app.use(
  cors({
    origin: PORT,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// import routes
import authRoutes from "./src/routes/authRoutes.js";

app.use("/api/auth", authRoutes);

app.listen(PORT, () =>
  console.log(`✅ Server is running on port http://localhost:${PORT}`)
);
