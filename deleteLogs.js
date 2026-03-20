// /backend/deleteLogs.js
// Run: node deleteLogs.js
require("dotenv").config();
const connectDB = require("./config/db");
const AuditLog = require("./models/AuditLog");

const deleteLogs = async () => {
  try {
    await connectDB();

    const count = await AuditLog.countDocuments();
    console.log(`🗑️  Deleting ${count} audit logs...`);

    await AuditLog.deleteMany({});

    console.log("✅ All audit logs deleted successfully!");
  } catch (error) {
    console.error("❌ Failed to delete logs:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

deleteLogs();
