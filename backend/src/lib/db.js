import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

let isDbConnected = false;

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isDbConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    isDbConnected = false;
    console.error("MongoDB connection failed:", err);
  }
};

export const getDbStatus = () => isDbConnected && mongoose.connection.readyState === 1;

export default conn;
