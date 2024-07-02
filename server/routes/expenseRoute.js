import express from "express";
import { addExpense, getExpenses, getOneExpense, editExpense, deleteExpense } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/:id", authMiddleware, getOneExpense);
router.put("/:id", authMiddleware, editExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
