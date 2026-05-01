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

// here we are connecting db and then start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("mongo connected");
    app.listen(PORT, () => {
      console.log("server running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("db error", err.message);
  });
