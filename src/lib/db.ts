import mongoose from 'mongoose';

const MONGOOSE_URI = process.env.MONGOOSE_URI!
if (!MONGOOSE_URI) throw new Error("Missing MongoDB URL");

export const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(MONGOOSE_URI);
};