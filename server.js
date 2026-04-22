const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// DB connect (safe)
connectDB().catch(err => console.log("DB Error:", err));

// ❌ REMOVE app.listen completely for Vercel

module.exports = app;