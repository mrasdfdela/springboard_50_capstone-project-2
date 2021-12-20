"use strict";

/** Routes for bikes */
const Bike = require("../models/bike");
// const { BadRequestError, NotFoundError } = require("../expressError");

const jsonschema = require("jsonschema");
// const { ensureCorrectUser } = require("../middleware/auth");

const express = require("express");
const router = new express.Router();

// POST new bikes
router.post("/", async function(req,res,next){
  try {
    const athleteId = req.body.id
    const bikes = req.body.bikes;

    for (const bike of bikes) {
      // Checks if bikes exists, then populates bikes
      const bikeExists = await Bike.bikeExists(bike.id);
      if (!bikeExists) {
        console.log(`inserting bike: ${bike.id}`);
        const { id, distance, name, nickname } = bike;
        await Bike.new(id, athleteId, distance, name, name, nickname);
      } else {
        console.log(`Duplicate bike id: ${bike.id}`);
      }
    }

    return res.status(201).json({ new_bike_records: bikes.length });
  } catch(err) {
    return next(err);
  }
});

// GET bike by ID
router.get("/:bike_id", async function (req, res, next) {
  try {
    const bikes = await Bike.getById(req.params.bike_id);
    return res.status(200).json({bikes})
  } catch (err) {
    return next(err);
  }
});

// GET bikes by athleteId
router.get("/", async function(req, res, next) {
  try {
    const { athleteId, startDt, endDt } = req.body;
    if (athleteId && startDt) {
      const bikes = await Bike.getByDates(athleteId, startDt, endDt);
      return res.status(200).json({bikes});
    } else {
      return res.status(204).json({ "msg":"missing athlete id or start date" });
    }
  } catch(err) {
    return next(err);
  }
});

// DELETES bikes by ID
router.delete("/:bikes_id", async function (req, res, next) {
  try {
    await Bike.remove(req.params.bikes_id);
    return res.status(204).json({ deleted: req.params.bikes_id });
  } catch(err) {
    return next(err);
  }
});

module.exports = router;