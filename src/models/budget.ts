import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
    username: String,
    month: String,
    budgetAmount: Number,
    createdAt: Date
});

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema);