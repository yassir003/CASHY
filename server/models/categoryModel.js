import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },budget:{
    type: Number,
    required: true
  },spent:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Expense",
    required: true
  },color:{
    type: String,
    required: true
  },icon:{
    type: String,
    required:true
  }
});

export default mongoose.model("Category", categorySchema);
