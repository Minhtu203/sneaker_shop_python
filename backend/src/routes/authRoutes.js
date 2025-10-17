import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { middlewareController } from "../middleware/auth.js";

const router = Router();

// rf token
router.post("/refreshToken", authController.requestRefreshToken);

//register
router.post("/register", authController.registerUser);

//login
router.post("/login", authController.loginUser);

//logout
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.logoutUser
);

router.post("/forgot-password", authController.forgotPassword); // forgot password

router.post("/reset-password", authController.resetPassword); // reset pword

export default router;
