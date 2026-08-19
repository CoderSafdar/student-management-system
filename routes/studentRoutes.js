const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET - saare students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to load students" });
  }
});

// POST - naya student add
router.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, course, address } = req.body;
    await Student.create({ fullName, email, phone, course, address });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add student" });
  }
});

// PUT - student update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, course, address } = req.body;
    await Student.updateOne(
      { _id: id },
      { fullName, email, phone, course, address },
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update student" });
  }
});

// DELETE - student mitao
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Student.deleteOne({ _id: id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete student" });
  }
});

module.exports = router;
