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


// Get the last 5 expenses for the current month
export const getLastFiveThisMonthExpenses = async (req, res) => {
    try {
        const today = new Date(); // Get the current date
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        const expenses = await Expense.find({
            userId: req.user.userId, // Filter by user
            date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter by date range (this month)
        })
            .sort({ date: -1 }) // Sort by date in descending order (most recent first)
            .limit(5); // Limit the results to 5

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for this month" });
        }

        res.json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get expenses for the current month
export const getThisMonthExpenses = async (req, res) => {
    try {
        const today = new Date(); // Get the current date
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        const expenses = await Expense.find({
            userId: req.user.userId, // Filter by user
            date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter by date range (this month)
        });

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for this month" });
        }

        res.json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};