const router = require("express").Router();
const db = require("../models");

router.post("/api/workouts", ({ body }, res) => {
  db.workout.create(body).then(dbWorkouts => {res.json(dbWorkouts);})
  .catch(err => { res.status(400).json(err); });
});

router.put("/api/workouts/:id", (req, res) => {
  db.workout.findOneAndUpdate({_id:req.params.id}, { $push: { exercises: req.body } }, {new: true})
  .then(dbWorkouts => { res.json(dbWorkouts); })
  .catch(err => { res.status(400).json(err); });
});

router.get("/exercise", (req, res) => {
  res.redirect("/exercise.html");
});

router.get("/stats", (req, res) => {
  res.redirect("/stats.html");
});

router.get("/api/workouts", (req, res) => {
  db.workout.find({}).then(dbWorkouts => {
    res.json(dbWorkouts);
  }).catch(err => { res.status(400).json(err); });
});

router.get("/api/workouts/range", (req, res) => {
  db.workout.find({}).then(dbWorkouts => { res.json(dbWorkouts); })
  .catch(err => { res.status(400).json(err); });
});

module.exports = router;