/** Routes for users. */
"use strict";

const User = require("../models/user");
const Bike = require("../models/bike");
const Goal = require("../models/goal");
const { BadRequestError } = require("../expressError");

const jsonschema = require("jsonschema");
const userUpdateSchema = require("../schemas/userUpdate.json");
const { ensureCorrectUser } = require("../middleware/auth");
const { kjToCal, metersToMiles, secondsToTime } = require("../helpers/conversions");


const express = require("express");
const router = express.Router();

// GET user by ID
// Pass in query parameter username
// Return user object
router.get("/:username", 
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

// GET bikes by user ID
// Pass in query parameter username
// Return an array of bike objects
router.get("/:username/bikes", 
  async function (req, res, next) {
    try {
      const user = await User.getDetails(req.params.username);
      const bikes = await Bike.getByAthleteId(user.athlete_id);
      return res.json({ bikes });
    } catch (err) {
      return next(err);
    }
  }
);

// GET goals by user ID
// Pass in query parameters username, count (goals per page), and page (SQL offset)
// Return an array (n = count) of goal objects
router.get("/:username/goals", 
  async function (req, res, next) {
    try {
      const username = req.params.username;
      const { count, page } = req.query;
      const offset = count * (page - 1);
      
      let goals = await Goal.getUserGoals(username, count, offset);
      for (let g of goals) {
        g.miles = metersToMiles(g.distance);
        g.calories = kjToCal(g.kilojoules);
        g.time = secondsToTime(g.time);
      }
      return res.json({ goals });
    } catch (err) {
      return next(err);
    }
  }
);

// GET goal count by user ID
// Pass in query parameters username
// Return a count object
router.get("/:username/goals-count", 
  async function (req, res, next) {
    try {
      const countRes = await Goal.getUserGoalCount(req.params.username);
      return res.json(countRes);
    } catch (err) {
      return next(err);
    }
  }
);

// GET user details by user ID
// Pass in query parameters username
// Return a user object
router.get("/:username/details",
  async function (req, res, next) {
    try {
      const user = await User.getDetails(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 * Data can include: { firstName, lastName, email, password }
 * Returns { username, firstName, lastName, email }
 * Authorization required: same-user-as-:username **/
router.patch("/:username", 
  ensureCorrectUser, 
  async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;