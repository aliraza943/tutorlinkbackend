const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["online", "offline"], required: true },
    subject: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    availableDays: { type: [String], required: true },
    availableTime: { type: [String], required: true },
    isRated: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

const Tutor = mongoose.model("Tutor", tutorSchema);

module.exports = Tutor;
