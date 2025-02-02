const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  teacherName: {
    type: String,
    required: true,
    trim: true,
  },
  teacherEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  sessionTitle: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isReviewed: {
    type: Boolean,
    default: false,
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
