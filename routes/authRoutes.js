const express = require("express");
const router = express.Router();

const { register, login, linkChild } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// 🔥 NEW ROUTE
router.post("/link-child", authMiddleware, linkChild);

module.exports = router;
