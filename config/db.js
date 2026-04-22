const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("DB Error:", error.message);
    // ❌ DO NOT exit process in Vercel
  }
};

module.exports = connectDB;