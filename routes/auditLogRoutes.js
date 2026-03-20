// /backend/routes/auditLogRoutes.js
const router = require("express").Router();
const { getLogs } = require("../controllers/auditLogController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", protect, adminOnly, getLogs);

module.exports = router;
