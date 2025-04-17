import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: String,
    color: String,
    createdAt: Date,
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);