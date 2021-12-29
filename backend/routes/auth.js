"use strict";

const express = require("express");
const passport = require("passport");
const cors = require("cors");
const StravaStrategy = require("passport-strava-oauth2").Strategy;

const jsonschema = require("jsonschema");
const userAuthSchema = require("../schemas/userAuth.json");
const userUpdateStrava = require("../schemas/userUpdateStrava.json");
const userRegisterSchema = require("../schemas/userRegister.json");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");
// stores strava secret locally; needs to eventually be setup on the server
const {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  frontendUri,
} = require("../config");
const { route } = require("./users");

const router = new express.Router();
// router.use(passport.initialize());
// router.use(passport.session());
// router.use(cors());

// passport.serializeUser(function (user, done) { done(null, user) });
// passport.deserializeUser(function (obj, done) { done(null, obj) });

// Setup strava strategy & check authentication
// passport.use(
//   new StravaStrategy(
//     {
//       clientID: STRAVA_CLIENT_ID,
//       clientSecret: STRAVA_CLIENT_SECRET,
//       callbackURL: "http://localhost:3001/auth/strava/callback",
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log("we are in the strava passport strategy callback");
//       // asynchronous verification, for effect...
//       process.nextTick(function () {
//         console.log("next tick - do not think we'll reach here..");
//         // To keep the example simple, the user's Strava profile is returned to
//         // represent the logged-in user.  In a typical application, you would want
//         // to associate the Strava account with a user record in your database,
//         // and return that user instead.
//         return done(null, profile);
//       });
//     }
//   )
// );

// Strava Routes Middleware
// router.get('/strava',
  
//   //passport.authenticate('strava', { scope: ['public'] }), // <<<<<<<< TRY: do not use this middleware 
//   passport.authenticate('strava', { scope: ['public'] }),
//   function(req, res){
//     // clientId = STRAVA_CLIENT_ID;
//     // <<<<<<<<<<<< redirect the directyl to the url with the specific query parameter as done with Insomniaz
//     res.redirect(302,
//       `https://www.strava.com/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2F3001%2Fauth%2Fstrava%2Fcallback&scope=activity%3Aread_all,activity%3Awrite&client_id=73357`
//     );
//     // https://www.strava.com/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2F3001%2Fauth%2Fstrava%2Fcallback&scope=activity%3Aread_all,activity%3Awrite&client_id=73357
//     // The request will be redirected to Strava for authentication, so this function will not be called.
//   });
  
router.get('/strava/callback', 
  function(req, res) {
    const queryParams = req.query;
    User.update( queryParams.state, { strava_auth_code: queryParams.code });

    res.writeHead(302, { Location: `${frontendUri}` });
    res.end();
});

router.post('/strava/tokens', async function(req,res){
  try {
    const { 
      username, 
      refresh_token, 
      access_token, 
      athlete_id, 
      last_refresh 
    } = req.body;
    const user = await User.update( username, 
      { 
        strava_access_token: access_token,
        strava_refresh_token: refresh_token,
        athlete_id: athlete_id,
        last_refresh: last_refresh
      });
    return res.json({ user });
  } catch(err) {
    return next(err);
  }
});

// POST /auth/token:  { username, password } => { token }
// Route for logging into the system; returns JWT token to front end, which can be saved to browser to authenticate future requests
// Authorization required: none
router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body,userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    // https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81
    // res.cookie('token', token, { httpOnly: true });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});


/** POST /auth/register:   { user } => { token }
 * user must include { username, password, firstName, lastName, email }
 * Returns JWT token which can be used to authenticate further requests.
 * Authorization required: none
 */
router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;