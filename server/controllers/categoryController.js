import Category from "../models/categoryModel.js";

// Add a new category
export const addCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = new Category({ name, description, userId: req.user.userId });
        await category.save();
        res.status(201).json({ message: "Category added successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all categories for a user
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.userId });
        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }
        res.json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get one category by ID
export const getOneCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Edit a category
export const editCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
