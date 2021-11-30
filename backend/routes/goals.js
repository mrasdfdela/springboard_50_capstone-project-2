"use strict";

/** Routes for goals */
const Goal = require("../models/goal");
// const { BadRequestError, NotFoundError } = require("../expressError");

const jsonschema = require("jsonschema");
const { ensureCorrectUser } = require("../middleware/auth");

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = new express.Router();

// POST new goal
router.post("/", async function(req,res,next){
  try {
    const reqBody = req.body
    const { username, distance, kilojoules, movingTime, startDt, endDt } = reqBody;

    const goal = await Goal.new(
      username, 
      distance, 
      kilojoules, 
      movingTime, 
      startDt, 
      endDt);
    return res.status(201).json({ goal });
  } catch(err) {
    return next(err);
  }
});

// GET goal by ID
router.get("/:goal_id", async function (req, res, next) {
  try {
    const goals = await Goal.getById(req.params.goal_id);
    return res.status(200).json({goals})
  } catch (err) {
    return next(err);
  }
});

// PATCHES goals by ID
router.patch("/:goals_id", 
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      // const validator = jsonschema.validate(req.body, goalUpdateSchema);
      // if (!validator.valid) {
      //   const errs = validator.errors.map( (e)=> e.stack );
      //   throw new BadRequestError(errs);
      // }
      const newGoal = await User.update(req.params.goals_id, req.body);
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