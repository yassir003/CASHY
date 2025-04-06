import express from "express";
import { addExpense, getExpenses, getOneExpense, editExpense, deleteExpense, getLastFiveThisMonthExpenses, getThisMonthExpenses, deleteExpensesByCategory } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/last-five-this-month", authMiddleware, getLastFiveThisMonthExpenses);
router.get("/this-month", authMiddleware, getThisMonthExpenses);
router.get("/:id", authMiddleware, getOneExpense);
router.put("/:id", authMiddleware, editExpense);
router.delete("/:id", authMiddleware, deleteExpense);
router.delete('/category/:categoryId', authMiddleware, deleteExpensesByCategory);

export default router;
