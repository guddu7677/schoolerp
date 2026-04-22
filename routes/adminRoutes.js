const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { createUserByAdmin } = require("../controllers/adminController");

router.post(
  "/create-user",
  authMiddleware,
  roleMiddleware("admin"),
  createUserByAdmin
);

module.exports = router;