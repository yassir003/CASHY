import Budget from "../models/budgetModel.js";

// Set a budget
export const setBudget = async (req, res) => {
    const { amount } = req.body;

    try {
        const budget = new Budget({ amount, userId: req.user.userId });
        await budget.save();
        res.status(201).json({ message: "Budget set successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get one budget by ID
export const getOneBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.json(budget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit a budget
export const editBudget = async (req, res) => {
    const { amount } = req.body;

    try {
        const budget = await Budget.findByIdAndUpdate(req.params.id, { amount }, { new: true });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.json(budget);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
