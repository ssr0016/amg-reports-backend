// /backend/seedAdmin.js
// Run: node seedAdmin.js
require("dotenv").config();
const User = require("./models/User");
const connectDB = require("./config/db");

const admins = [
  {
    name: "Administrator",
    email: "admin@gmail.com",
    username: "admin",
    password: "Abcd@1234",
    role: "admin",
    areaAssignment: "Manila",
    churchName: "AMGC Church",
  },
  {
    name: "Administrator 2",
    email: "admin2@gmail.com",
    username: "admin2",
    password: "Abcd@1234",
    role: "admin",
    areaAssignment: "Manila",
    churchName: "AMGC Church",
  },
  {
    name: "Administrator 3",
    email: "admin3@gmail.com",
    username: "admin3",
    password: "Abcd@1234",
    role: "admin",
    areaAssignment: "Manila",
    churchName: "AMGC Church",
  },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({ role: "admin" });
    console.log("🗑️  Cleared existing admin accounts.");

    for (const adminData of admins) {
      await User.create(adminData);
      console.log(`✅ Admin created: ${adminData.username}`);
    }

    console.log("\n🎉 Admin seed complete!");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seed();
