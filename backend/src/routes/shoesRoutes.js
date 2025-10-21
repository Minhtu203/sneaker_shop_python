import { Router } from "express";
import { middlewareController } from "../middleware/auth.js";
import { shoesController } from "../controllers/shoesController.js";

const router = Router();

// get all shoes
router.get(
  "/getAllShoes",
  middlewareController.verifyToken,
  shoesController.getAllShoes
);

//get shoes by id
router.post(
  "/getShoesById",
  middlewareController.verifyToken,
  shoesController.getShoesById
);

// create shoes
router.post(
  "/createShoes",
  middlewareController.verifyAdminToken,
  shoesController.createShoes
);

// update shoes
router.put(
  "/updateShoes/:id",
  middlewareController.verifyAdminToken,
  shoesController.updateShoes
);

//delete shoes
router.delete(
  "/deleteShoes/:id",
  middlewareController.verifyAdminToken,
  shoesController.deleteShoes
);

export default router;
