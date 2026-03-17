require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
