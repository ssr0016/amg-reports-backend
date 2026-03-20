// /backend/models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    // Who did the action
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByName: {
      type: String,
      required: true,
    },
    performedByRole: {
      type: String,
      required: true,
    },

    // What action
    action: {
      type: String,
      required: true,
      enum: [
        "APPROVE_REPORT",
        "UNAPPROVE_REPORT",
        "DELETE_REPORT",
        "CREATE_USER",
        "UPDATE_USER",
        "DELETE_USER",
        "DOWNLOAD_SINGLE_EXCEL",
        "DOWNLOAD_BULK_EXCEL",
        "LOGIN",
        "LOGOUT",
      ],
    },

    // Details about the action
    targetType: {
      type: String,
      enum: ["Report", "User", "System"],
      required: true,
    },
    targetId: {
      type: String,
      default: null,
    },
    targetName: {
      type: String,
      default: null,
    },

    // Extra details (e.g. month/year for download)
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // IP address (optional)
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index para sa mabilis na query
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ targetType: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
