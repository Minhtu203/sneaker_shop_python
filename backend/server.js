import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;
const CLIENT = process.env.CLIENT;

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use(
  cors({
    origin: CLIENT,
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running on Vercel",
    status: "OK",
  });
});

// import routes
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import shoesRoutes from "./src/routes/shoesRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import favouritesRoutes from "./src/routes/favouritesRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shoes", shoesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favourite", favouritesRoutes);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
// export default app;
