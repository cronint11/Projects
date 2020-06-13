const mongoose = require("mongoose");
const exercise = require("./exercise");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  day: {
    type: Date,
    default: Date.now
  },
  exercises: [
    {
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
    }
  ]
});

const workout = mongoose.model("workout", workoutSchema);

module.exports = workout;