import Invitation from "../models/invitationModel.js";

// Send an invitation
export const sendInvitation = async (req, res) => {
    const { receiverId } = req.body;

    try {
        const invitation = new Invitation({ senderId: req.user.userId, receiverId });
        await invitation.save();
        res.status(201).json(invitation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Accept an invitation
export const acceptInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findByIdAndUpdate(req.params.id, { status: "accepted" }, { new: true });
        res.json(invitation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all invitations
export const getInvitations = async (req, res) => {
    try {
        const invitations = await Invitation.find({ receiverId: req.user.userId });
        res.json(invitations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Reject an invitation
export const rejectInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
        res.json(invitation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
