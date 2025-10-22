import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { middlewareController } from "../middleware/auth.js";

const router = Router();

// delete user
router.delete(
  "/:id",
  middlewareController.verifyAdminToken,
  userController.deleteUser
);

router.get("/getUserByid/:id", userController.getUser); // get user by id

// get all users
router.get(
  "/allusers",
  middlewareController.verifyAdminToken,
  userController.getAllUsers
);

export default router;
