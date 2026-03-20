// /backend/routes/reportRoutes.js
const router = require("express").Router();
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  toggleComplete,
  getSingleReport,
  logDownload,
} = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", protect, getReports); // lahat
router.post("/", protect, createReport); // lahat (may login)
router.put("/:id", protect, updateReport); // may ownership check
router.delete("/:id", protect, deleteReport); // may ownership check
router.patch("/:id/complete", protect, adminOnly, toggleComplete); // admin only
router.get("/:id", protect, getSingleReport); // lahat
router.post("/log-download", protect, logDownload); // Log Excel download

module.exports = router;
