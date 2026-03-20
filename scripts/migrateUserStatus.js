// /backend/scripts/migrateUserStatus.js
// Run this once: node backend/scripts/migrateUserStatus.js

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function migrate() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected!");

    // ✅ Update all users na walang status — set to "active"
    const result = await User.updateMany(
      { status: { $exists: false } }, // walang status field
      { $set: { status: "active" } }, // i-set sa active
    );

    console.log(`✅ Migration done! Updated ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrate();
