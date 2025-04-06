import Expense from "../models/expenseModel.js";

// Add a new expense
export const addExpense = async (req, res) => {
    const { name, amount, date, type, categoryId } = req.body;

    try {
        const expense = new Expense({name, amount, date, categoryId, type,  userId: req.user.userId });
        await expense.save();
        res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all expenses for a user
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.userId })
            .populate('categoryId', 'name color icon'); // Populate category details
            
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
        const expense = await Expense.findById(req.params.id)
            .populate('categoryId', 'name color icon');
            
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
    const { name, amount, date, type, categoryId } = req.body;

    try {
        const expense = await Expense.findByIdAndUpdate(
            req.params.id, 
            { name, amount, date, type, categoryId }, 
            { new: true }
        ).populate('categoryId', 'name color icon');
        
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
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const expenses = await Expense.find({
            userId: req.user.userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        })
            .populate('categoryId', 'name color icon')
            .sort({ date: -1 })
            .limit(5);

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
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const expenses = await Expense.find({
            userId: req.user.userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        }).populate('categoryId', 'name color icon');

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for this month" });
        }

        res.json(expenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete expenses by categoryId
export const deleteExpensesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const userId = req.user.userId;

        const result = await Expense.deleteMany({ 
            userId: userId,
            categoryId: categoryId 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ 
                message: "No expenses found for this category" 
            });
        }

        res.json({ 
            message: `Successfully deleted ${result.deletedCount} expenses` 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};