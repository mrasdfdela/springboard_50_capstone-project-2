/** Routes for bikes */
"use strict";

const Bike = require("../models/bike");
const jsonschema = require("jsonschema");

const express = require("express");
const router = new express.Router();

// POST bikes (that are downloaded from Strava)
// Bike objects are downloaded from strava
// Passes in an array of bikes {id, athleteId, distance, name, nickname }
// Returns an object with new bike count { new_bike_records: {{someNumber}} }
router.post("/", async function(req,res,next){
  try {
    const athleteId = req.body.id
    const bikes = req.body.bikes;

    for (const bike of bikes) {
      // Checks if bikes exists, then populates bikes
      const bikeExists = await Bike.bikeExists(bike.id);
      if (!bikeExists) {
        const { id, distance, name, nickname } = bike;
        const resp = await Bike.new(id, athleteId, distance, name, name, nickname);
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
// Pass in query parameter bike_id
// Return bike object
router.get("/:bike_id", async function (req, res, next) {
  try {
    const bikes = await Bike.getById(req.params.bike_id);
    return res.status(200).json({bikes})
  } catch (err) {
    return next(err);
  }
});

// GET a count of user's/athlete's activities
// Pass in query parameter athleteId
// Returns an array of bikes
router.get("/", async function(req, res, next) {
  try {
    const { athleteId, startDt, endDt } = req.body;
    if (athleteId && startDt) {
      const bikes = await Bike.getByAthleteId(athleteId, startDt, endDt);
      return res.status(200).json({bikes});
    } else {
      return res.status(204).json({ "msg":"missing athlete id or start date" });
    }
  } catch(err) {
    return next(err);
  }
});

// DELETES bikes by ID
// Pass in query parameter bike_id
// Returns object confirming deletion
router.delete("/:bike_id", async function (req, res, next) {
  try {
    const resp = await Bike.remove(req.params.bike_id);
    return res.status(204).json(resp);
  } catch(err) {
    return next(err);
  }
});

module.exports = router;