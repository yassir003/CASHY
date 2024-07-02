import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export default mongoose.model("Budget", budgetSchema);
