import express from "express";
import { addCategory, getCategories, getOneCategory, editCategory, deleteCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addCategory);
router.get("/", authMiddleware, getCategories);
router.get("/:id", authMiddleware, getOneCategory);
router.put("/:id", authMiddleware, editCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
