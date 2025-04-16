import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: String,
    username: String,
    createdAt: Date,
    updatedAt: Date,
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);