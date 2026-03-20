// /backend/utils/logAction.js
const AuditLog = require("../models/AuditLog");

/**
 * Log an admin/user action to the audit log.
 *
 * @param {Object} params
 * @param {Object} params.user        - req.user (must have _id, name, role)
 * @param {string} params.action      - One of the AuditLog action enums
 * @param {string} params.targetType  - "Report" | "User" | "System"
 * @param {string} [params.targetId]  - ID of the affected document
 * @param {string} [params.targetName]- Human-readable name (worker name, church, etc.)
 * @param {Object} [params.details]   - Any extra info (month, year, count, etc.)
 * @param {Object} [params.req]       - Express request object (for IP)
 */
const logAction = async ({
  user,
  action,
  targetType,
  targetId = null,
  targetName = null,
  details = {},
  req = null,
}) => {
  try {
    await AuditLog.create({
      performedBy: user._id,
      performedByName: user.name,
      performedByRole: user.role,
      action,
      targetType,
      targetId: targetId ? String(targetId) : null,
      targetName,
      details,
      ipAddress: req
        ? req.headers["x-forwarded-for"] ||
          req.connection?.remoteAddress ||
          null
        : null,
    });
  } catch (err) {
    // Never crash the main request because of a logging failure
    console.error("[AuditLog] Failed to write log:", err.message);
  }
};

module.exports = logAction;
