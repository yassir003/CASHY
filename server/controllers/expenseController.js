import Expense from "../models/expenseModel.js";

// Add a new expense
export const addExpense = async (req, res) => {
    const { amount, date, description, categoryId } = req.body;

    try {
        const expense = new Expense({ amount, date, description, categoryId, userId: req.user.userId });
        await expense.save();
        res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all expenses for a user
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId });
        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found" });
        }
        res.json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get one expense by ID
export const getOneExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit an expense
export const editExpense = async (req, res) => {
    const { amount, date, description, categoryId } = req.body;

    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, { amount, date, description, categoryId }, { new: true });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
