const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

exports.linkChild = async (req, res) => {
  try {
    const { rollNumber, name } = req.body;

    const student = await Student.findOne({
      rollNumber,
      name
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const parent = await User.findById(req.user.id);

    // avoid duplicate
    if (parent.children?.includes(student._id)) {
      return res.status(400).json({
        message: "Child already linked"
      });
    }

    parent.children = parent.children || [];
    parent.children.push(student._id);

    await parent.save();

    res.json({
      message: "Child linked successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
      console.log("REGISTER API HIT");
    console.log(req.body);

    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "parent"
    });

    res.status(201).json({
      message: "Parent registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { mobile }]
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
