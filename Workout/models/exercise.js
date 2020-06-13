const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  type: {
    type: String,
    trim: true,
    req: "Workout Type"
  },
  name: {
    type: String,
    trim: true,
    required: "Workout Name"
  },
  duration: {
    type: Number,
    required: "Duration"
  },
  distance: {
    type: Number
  },
  weight: {
    type: Number
  },
  reps: {
    type: Number
  },
  sets: {
    type: Number
  }
});

const exercise = mongoose.model("exercise", exerciseSchema);

module.exports = exercise;