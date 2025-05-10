const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  feedback: { type: String, required: true },
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", testimonialSchema);

// backend/routes/testimonials.js
const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const auth = require("../middleware/authmiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const testimonial = new Testimonial({ ...req.body, image: req.file ? req.file.path : "" });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Testimonial deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

// Register testimonial route in server.js
// In backend/server.js (already partially written)
app.use("/api/testimonials", require("./routes/testimonials"));