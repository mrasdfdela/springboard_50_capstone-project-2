"use strict";

/** Routes for activities */
const Activity = require("../models/activity");
const { BadRequestError, NotFoundError } = require("../expressError");

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
        console.log(`inserting activity: ${activity.id}`);
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
    const { athleteId, startDt, endDt } = req.body;
    if (athleteId && startDt) {
      const activities = await Activity.getByDates(athleteId, startDt, endDt);
      return res.status(200).json({activities});
    } else {
      return res.status(204).json({ "msg":"missing athlete id or start date" });
    }
  } catch(err) {
    return next(err);
  }
});

router.get("/count", async function(req,res,next){
  try {
    console.log(`activities route, count`)
    console.log(req.body.athlete_id);
    // const athleteId = req.body.athleteId;
    // console.log(athleteId);
    // const countRes = await Activity.getCount(athleteId);
    // console.log(`route activities, countRes:`)
    // console.log(countRes);
    // return countRes;
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