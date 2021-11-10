"use strict";

/** Routes for users. */
const User = require("../models/user");
const { BadRequestError } = require("../expressError");

const jsonschema = require("jsonschema");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");
// const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");

const express = require("express");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 * Returns list of all users.
 * Authorization required: admin
 **/
// router.get("/", ensureAdmin, async function (req, res, next) {
//   try {
//     const users = await User.findAll();
//     return res.json({ users });
//   } catch (err) {
//     return next(err);
//   }
// });

/** GET /[username] => { user }
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username",
  // ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/
// router.patch(
//   "/:username",
//   ensureCorrectUserOrAdmin,
//   async function (req, res, next) {
//     try {
//       const validator = jsonschema.validate(req.body, userUpdateSchema);
//       if (!validator.valid) {
//         const errs = validator.errors.map((e) => e.stack);
//         throw new BadRequestError(errs);
//       }

//       const user = await User.update(req.params.username, req.body);
//       return res.json({ user });
//     } catch (err) {
//       return next(err);
//     }
//   }
// );

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

// router.delete(
//   "/:username",
//   ensureCorrectUserOrAdmin,
//   async function (req, res, next) {
//     try {
//       await User.remove(req.params.username);
//       return res.json({ deleted: req.params.username });
//     } catch (err) {
//       return next(err);
//     }
//   }
// );

/** POST /[username]/jobs/[id]  { state } => { application }
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

// router.post(
//   "/:username/jobs/:id",
//   ensureCorrectUserOrAdmin,
//   async function (req, res, next) {
//     try {
//       const jobId = +req.params.id;
//       await User.applyToJob(req.params.username, jobId);
//       return res.json({ applied: jobId });
//     } catch (err) {
//       return next(err);
//     }
//   }
// );

module.exports = router;