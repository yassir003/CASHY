import express from "express";
import { setBudget, getBudgets, getOneBudget, editBudget, deleteBudget } from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, setBudget);
router.get("/", authMiddleware, getBudgets);
router.get("/:id", authMiddleware, getOneBudget);
router.put("/:id", authMiddleware, editBudget);
router.delete("/:id", authMiddleware, deleteBudget);

export default router;
