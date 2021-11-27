"use strict";

/** Routes for bikes */
const Bike = require("../models/bike");
// const { BadRequestError, NotFoundError } = require("../expressError");

const jsonschema = require("jsonschema");
// const { ensureCorrectUser } = require("../middleware/auth");

const express = require("express");
const router = new express.Router();

// POST new activities
router.post("/", async function(req,res,next){
  try {
    const activities = req.body;
    for (const activity of activities) {
      // Checks if activity exists before populating activity
      const activityExists = await Bike.activityExists(activity.id);
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
        } = activity;

        await Bike.new(
          String(id),
          String(athlete.id),
          start_date,
          type,
          distance,
          kilojoules,
          moving_time,
          name
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

// GET activity by ID
router.get("/:activity_id", async function (req, res, next) {
  try {
    const activity = await Bike.getById(req.params.activity_id);
    return res.status(200).json({activity})
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function(req, res, next) {
  try {
    const { athleteId, startDt, endDt } = req.body;
    if (athleteId && startDt) {
      const activities = await Bike.getByDates(athleteId, startDt, endDt);
      return res.status(200).json({activities});
    } else {
      return res.status(204).json({ "msg":"missing athlete id or start date" });
    }
  } catch(err) {
    return next(err);
  }
});

// DELETES activity by ID
router.delete("/:activity_id", async function (req, res, next) {
  try {
    await Bike.remove(req.params.activity_id);
    return res.status(204).json({ deleted: req.params.activity_id });
  } catch(err) {
    return next(err);
  }
});

// PATCHES activity by ID
// router.patch("/:activity_id", async function (req, res, next) {
// });

module.exports = router;