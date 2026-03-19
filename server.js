require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);

  if (process.env.NODE_ENV === "production") {
    setInterval(async () => {
      try {
        await fetch(process.env.RENDER_EXTERNAL_URL);
        console.log("Self-ping successful");
      } catch (err) {
        console.log(err.message);
      }
    }, 14 * 60 * 1000);
  }
});
