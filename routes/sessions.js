const express = require("express");
const router = express.Router();
const Session = require("../models/sessionModel");


router.post("/addASession", async (req, res) => {
  console.log("DAMN")
  try {
    const {
      teacherId,
      teacherName,
      teacherEmail,
      studentId,
      studentName,
      studentEmail,
      sessionTitle,
      date,
      startTime,
      endTime,
    } = req.body;

    const newSession = new Session({
      teacherId,
      teacherName,
      teacherEmail,
      studentId,
      studentName,
      studentEmail,
      sessionTitle,
      date,
      startTime,
      endTime,
    });

    const savedSession = await newSession.save();

    res.status(201).json({
      message: "Session created successfully",
      session: savedSession,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
});

router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

router.get("/TutorSession/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;

    const sessions = await Session.find({ teacherId: teacherId });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found for this teacher" });
    }

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSession = await Session.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ error: "Failed to update session" });
  }
});

router.get("/getstudentSessions/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const sessions = await Session.find({ studentId });

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found for this student" });
    }

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions by student ID:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({
      message: "Session deleted successfully",
      session: deletedSession,
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
});

module.exports = router;
