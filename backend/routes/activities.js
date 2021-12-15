"use strict";

/** Routes for activities */
const Activity = require("../models/activity");
const { BadRequestError, NotFoundError } = require("../expressError");

const { kjToCal, metersToMiles, secondsToTime } = require("../helpers/conversions");
const jsonschema = require("jsonschema");
const { ensureCorrectUser } = require("../middleware/auth");

const express = require("express");
const router = new express.Router();

// POST new activities
router.post("/", async function(req,res,next){
  try {
    const activities = req.body;
    for (const activity of activities) {
      // Checks if activity exists before populating activity
      const activityExists = await Activity.activityExists(activity.id);
      // Creates activity if it exists
      if (!activityExists) {
        const {
          id,
          athlete,
          start_date,
          type,
          distance,
          kilojoules,
          moving_time,
          name,
          trainer
        } = activity;

        await Activity.new(
          String(id),
          String(athlete.id),
          start_date,
          type,
          distance,
          kilojoules,
          moving_time,
          name,
          trainer
        );
      } else {
        console.log(`Duplicate activity id: ${activity.id}`);
      }
    }
    return res.status(201).json({ new_records: req.body.length });
  } catch(err) {
    return next(err);
  }
});

router.get("/", async function(req, res, next) {
  try {
    const { athleteId, count, page } = req.query;
    const offset = count * (page - 1);
    const activities = await Activity.getByAthlete(athleteId, count, offset);

    for (let a of activities){
      a.miles = metersToMiles(a.meters);
      a.time = secondsToTime(a.time);
      a.calories = kjToCal(a.kilojoules);
    }
    
    return res.status(200).json({ activities });
  } catch(err) {
    return next(err);
  }
});

router.get("/count", async function(req,res,next){
  try {
    const athleteId = req.query.athleteId;
    const countRes = await Activity.getCount(athleteId);
    return res.json(countRes.rows[0]);
  } catch(err) {
    return next(err);
  }
});

// GET activity by ID
router.get("/:activity_id", async function (req, res, next) {
  try {
    const activity = await Activity.getById(req.params.activity_id);
    return res.status(200).json({activity})
  } catch (err) {
    return next(err);
  }
});

// DELETES activity by ID
router.delete("/:activity_id", async function (req, res, next) {
  try {
    await Activity.remove(req.params.activity_id);
    return res.status(204).json({ deleted: req.params.activity_id });
  } catch(err) {
    return next(err);
  }
});

// PATCHES activity by ID
// router.patch("/:activity_id", async function (req, res, next) {
// });

module.exports = router;