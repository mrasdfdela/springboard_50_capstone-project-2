"use strict";

/** Routes for goals */
const Goal = require("../models/goal");
// const { BadRequestError, NotFoundError } = require("../expressError");

const { ensureCorrectUser } = require("../middleware/auth");
const {
  calToKj,
  milesToMeters,
  calcEndDt,
  timeToSeconds,
  kjToCal,
  metersToMiles,
  secondsToTime,
  datesToTimePeriod
} = require("../helpers/conversions");

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { getPackedSettings } = require("http2");
const router = new express.Router();

// POST new goal
router.post("/", async function(req,res,next){
  try {
    const reqBody = req.body
    const { calories, date, miles, time, timePeriod, username } = reqBody;
    
    const kilojoules = calToKj(calories);
    const meters = milesToMeters(miles);
    const endDt = calcEndDt(date, timePeriod);
    const seconds = timeToSeconds(time);

    console.log('posting new goal');
    const goal = await Goal.new(
      username, 
      meters, 
      kilojoules, 
      seconds,
      date, 
      endDt);
    return res.status(201).json({ goal });
  } catch(err) {
    return next(err);
  }
});

// GET goal by ID
router.get("/:goal_id", async function (req, res, next) {
  try {
    const goal = await Goal.getById(req.params.goal_id);

    let displayGoal = {};
    displayGoal.goalId = goal.goalid
    displayGoal.miles = metersToMiles(goal.distance);
    displayGoal.calories = kjToCal(goal.kilojoules);
    displayGoal.time = secondsToTime(goal.time);
    displayGoal.timePeriod = datesToTimePeriod(goal.startdt, goal.enddt);
    displayGoal.startdt = goal.startdt.toISOString().substr(0,10);
    displayGoal.enddt = goal.enddt.toISOString().substr(0,10);

    return res.status(200).json({ displayGoal });
  } catch (err) {
    return next(err);
  }
});

// PATCHES goals by ID
router.patch("/:goals_id", 
  // ensureCorrectUser,
  async function (req, res, next) {
    try {
      // const validator = jsonschema.validate(req.body, goalUpdateSchema);
      // if (!validator.valid) {
      //   const errs = validator.errors.map( (e)=> e.stack );
      //   throw new BadRequestError(errs);
      // }
      let goal = {};
      goal.start_date = req.body.startdt;
      goal.end_date = calcEndDt(req.body.startdt, req.body.timePeriod);
      goal.distance = milesToMeters(req.body.distance);
      goal.time = timeToSeconds(req.body.time);
      goal.kilojoules = calToKj(req.body.calories);

      const newGoal = await Goal.update(req.params.goals_id, goal);
      return res.json({ newGoal });
    } catch (err) {
      return next(err);
    }
});

// DELETES goals by ID
router.delete("/:goals_id", async function (req, res, next) {
  try {
    await Goal.remove(req.params.goals_id);
    return res.status(204).json({ deleted: req.params.goals_id });
  } catch(err) {
    return next(err);
  }
});

module.exports = router;