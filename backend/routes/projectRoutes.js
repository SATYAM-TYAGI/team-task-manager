const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/role");

const router = express.Router();

// so only admin can create project
router.post("/", auth, roleCheck(["admin"]), async (req, res) => {
  try {
    const { name, members } = req.body;
    if (!name) return res.status(400).json({ msg: "project name needed" });

    const proj = new Project({
      name,
      members: Array.isArray(members) ? members : [],
    });

    await proj.save();
    res.json(proj);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

// both role should be able to see projects they are in
router.get("/", auth, async (req, res) => {
  try {
    let projList = [];

    if (req.user.role === "admin") {
      projList = await Project.find().populate("members", "name email role");
    } else {
      projList = await Project.find({ members: req.user.id }).populate(
        "members",
        "name email role"
      );
    }

    res.json(projList);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

// admin can add members later also
router.put("/:id/members", auth, roleCheck(["admin"]), async (req, res) => {
  try {
    const { members } = req.body;
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ msg: "project not found" });

    proj.members = Array.isArray(members) ? members : proj.members;
    await proj.save();

    res.json(proj);
  } catch (err) {
    res.status(500).json({ msg: "server issue" });
  }
});

module.exports = router;
