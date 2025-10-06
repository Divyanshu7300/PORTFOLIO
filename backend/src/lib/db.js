import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

export default conn;
