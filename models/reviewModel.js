const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, unique: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    teacherName: { type: String, required: true },
    studentName: { type: String, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true }
);

reviewSchema.index({ sessionId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
