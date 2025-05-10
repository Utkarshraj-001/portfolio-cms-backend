const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/authmiddleware");

// Create
router.post("/", auth, async (req, res) => {
    try {
      const project = new Project(req.body);
      await project.save();
      res.status(201).json(project);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Read All
  router.get("/", async (req, res) => {
    try {
      const projects = await Project.find().sort({ createdAt: -1 });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Update
  router.put("/:id", auth, async (req, res) => {
    try {
      const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Delete
  router.delete("/:id", auth, async (req, res) => {
    try {
      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: "Project deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  module.exports = router;