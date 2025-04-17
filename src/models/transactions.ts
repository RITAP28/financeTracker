import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  date: Date,
  status: {
    type: String,
    enum: ["Processing", "Done", "Failed"],
    required: true,
  },
  description: String,
  category: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    color: String
  },
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true,
  },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
