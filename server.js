require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static("public"));

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is running");
  } catch (err) {
    console.log("Database is not responding:", err.message);
  }
}
connectDB();

app.use("/api/students", studentRoutes);

app.listen(port, () => console.log("Express is running"));
