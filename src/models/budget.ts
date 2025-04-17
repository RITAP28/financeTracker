
import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  category: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: String,
  },
  month: String,
  budgetAmount: Number,
  createdAt: Date,
});

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
