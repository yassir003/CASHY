import express from "express";
import { sendInvitation, acceptInvitation, getInvitations, rejectInvitation } from "../controllers/invitationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendInvitation);
router.get("/", authMiddleware, getInvitations);
router.put("/accept/:id", authMiddleware, acceptInvitation);
router.put("/reject/:id", authMiddleware, rejectInvitation);

export default router;
