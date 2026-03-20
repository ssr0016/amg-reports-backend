// /backend/routes/authRoutes.js
const router = require("express").Router();
const {
  login,
  getMe,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  logoutLog,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", protect, getMe);

// ✅ Admin only — user management
router.get("/users", protect, adminOnly, getUsers);
router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.post("/logout-log", protect, logoutLog);

module.exports = router;
