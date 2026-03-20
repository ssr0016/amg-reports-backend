// /backend/controllers/auditLogController.js
const AuditLog = require("../models/AuditLog");

/**
 * Get all audit logs — admin only
 * Supports: page, limit, action, performedBy
 */
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, performedBy } = req.query;

    const query = {};
    if (action) query.action = action;
    if (performedBy) query.performedBy = performedBy;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await AuditLog.countDocuments(query);

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: logs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
