// /backend/deleteReports.js
// Run: node deleteReports.js

require("dotenv").config();
const connectDB = require("./config/db");
const Report = require("./models/Report");

const deleteReports = async () => {
  try {
    await connectDB();

    const count = await Report.countDocuments();
    console.log(`🗑️  Deleting ${count} reports...`);

    await Report.deleteMany({});

    console.log("✅ All reports deleted successfully!");
  } catch (error) {
    console.error("❌ Failed to delete reports:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

deleteReports();
