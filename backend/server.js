const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// simple route for checking backend is running
app.get("/", (req, res) => {
  res.json({ msg: "Team Task Manager API running" });
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

// railway need this 0.0.0.0 so outside world can reach the server
const HOST = "0.0.0.0";

// railway mongo plugin sometimes use MONGO_URL or MONGODB_URI, we support both
const mongoConn =
  process.env.MONGO_URL || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!mongoConn) {
  console.log("ERROR: set MONGO_URL in env (or MONGODB_URI from railway mongo)");
  process.exit(1);
}

// here we are connecting db and then start server
mongoose
  .connect(mongoConn)
  .then(() => {
    console.log("mongo connected");
    app.listen(PORT, HOST, () => {
      console.log("server running on " + HOST + ":" + PORT);
    });
  })
  .catch((err) => {
    console.log("db error", err.message);
    process.exit(1);
  });
