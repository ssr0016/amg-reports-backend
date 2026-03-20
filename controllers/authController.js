// /backend/controllers/authController.js
const User = require("../models/User");
const Report = require("../models/Report");
const jwt = require("jsonwebtoken");
const logAction = require("../utils/logAction");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * Login
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username and password",
      });
    }

    const user = await User.findOne({ username });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // ✅ Log login
    await logAction({
      user,
      action: "LOGIN",
      targetType: "System",
      targetName: "System Login",
      details: { username: user.username },
      req,
    });

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get current logged in user
 */
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

/**
 * Create user — admin only
 */
exports.createUser = async (req, res) => {
  try {
    const { name, username, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
      role,
      status: status || "active",
    });

    // ✅ Log create user
    await logAction({
      user: req.user,
      action: "CREATE_USER",
      targetType: "User",
      targetId: user._id,
      targetName: user.name,
      details: { username: user.username, role: user.role },
      req,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status, // ✅
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

/**
 * Get all users — admin only
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // ✅ Filter by status if provided
    const query = {};
    if (status && status !== "all") query.status = status;

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update user — admin only
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, username, email, password, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const oldName = user.name;
    user.name = name || user.name;
    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    if (status) user.status = status; // ✅ update status
    if (password) user.password = password;

    await user.save();

    // ✅ Log update user
    await logAction({
      user: req.user,
      action: "UPDATE_USER",
      targetType: "User",
      targetId: user._id,
      targetName: user.name,
      details: {
        updatedFields: Object.keys(req.body).filter((k) => k !== "password"),
        previousName: oldName,
      },
      req,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status, // ✅ ibalik ang status sa response
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};

/**
 * Delete user — admin only
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const deletedName = user.name;
    const deletedUsername = user.username;

    // Delete all reports of this user first
    await Report.deleteMany({ createdBy: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    // ✅ Log delete user
    await logAction({
      user: req.user,
      action: "DELETE_USER",
      targetType: "User",
      targetId: req.params.id,
      targetName: deletedName,
      details: { username: deletedUsername, role: user.role },
      req,
    });

    res.status(200).json({
      success: true,
      message: "User and their reports deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

/**
 * Log logout — called from frontend before clearing token
 */
exports.logoutLog = async (req, res) => {
  try {
    await logAction({
      user: req.user,
      action: "LOGOUT",
      targetType: "System",
      targetName: "System Logout",
      details: { username: req.user.username },
      req,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    // Silent fail — logout should always proceed
    res.status(200).json({ success: true });
  }
};
