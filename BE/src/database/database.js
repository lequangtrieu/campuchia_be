// database/connect.js
import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://campuchiateam_db_user:lSYvzDglqW0i9l8l@campuchia.ycncxmu.mongodb.net/chat_app?retryWrites=true&w=majority&appName=Campuchia";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      tls: true, // Bắt buộc dùng TLS (Atlas yêu cầu)
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;