// /backend/seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const seed = async () => {
  await connectDB();
  await User.deleteMany({ username: "admin" });
  await User.create({
    name: "Administrator",
    email: "admin@gmail.com",
    username: "admin",
    password: "admin123",
    role: "admin",
  });
  console.log("✅ Admin created! username: admin / password: admin123");
  process.exit();
};

seed();
