import express from "express";
import { setBudget, getBudgetByUserId, editBudget, deleteBudget } from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, setBudget);
router.get("/:userId", authMiddleware, getBudgetByUserId);
router.put("/:id", authMiddleware, editBudget);
router.delete("/:id", authMiddleware, deleteBudget);


export default router;
