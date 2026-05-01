const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/role");

const router = express.Router();

// admin create task and assign user
router.post("/", auth, roleCheck(["admin"]), async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, status, dueDate } = req.body;

    if (!title || !assignedTo || !projectId) {
      return res.status(400).json({ msg: "title assignedTo projectId needed" });
    }

    const taskData = new Task({
      title,
      description,
      assignedTo,
      projectId,
      status: status || "todo",
      dueDate,
    });

    await taskData.save();
    res.json(taskData);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

// get tasks based on their role
router.get("/", auth, async (req, res) => {
  try {
    let taskList = [];

    if (req.user.role === "admin") {
      taskList = await Task.find()
        .populate("assignedTo", "name email")
        .populate("projectId", "name");
    } else {
      taskList = await Task.find({ assignedTo: req.user.id })
        .populate("assignedTo", "name email")
        .populate("projectId", "name");
    }

    res.json(taskList);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

// so member can update only status
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const taskData = await Task.findById(req.params.id);
    if (!taskData) return res.status(404).json({ msg: "task not found" });

    if (req.user.role === "member" && taskData.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ msg: "not your task" });
    }

    taskData.status = status || taskData.status;
    await taskData.save();
    res.json(taskData);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

// admin only should able to update full task
router.put("/:id", auth, roleCheck(["admin"]), async (req, res) => {
  try {
    const taskData = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!taskData) return res.status(404).json({ msg: "task not found" });
    res.json(taskData);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

module.exports = router;
