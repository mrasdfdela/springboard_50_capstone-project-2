"user strict";

const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const StravaStrategy = require('passport-strava-oauth2').Strategy;
// const { response } = require("express");
const cors = require("cors");

// stores strava secret locally; needs to eventually be setup on the server
const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require("./config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded( {extended: true} ));
app.use(passport.initialize());
app.use(passport.session());

const { NotFoundError } = require("./expressError");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
// const actRoutes = require("./routes/activities");
// const goalRoutes = require("./routes/goals");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// app.use("/activities", actRoutes);
// app.use("/goals", goalRoutes);

passport.serializeUser(function(user,done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done){
  done(null, obj);
});

// Setup strava strategy & check authentication
passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3001/auth/strava/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Strava Routes Middleware
app.get('/auth/strava',
  passport.authenticate('strava', { scope: ['public'] }),
  function(req, res){
    // The request will be redirected to Strava for authentication, so this function will not be called.
  });
app.get('/auth/strava/callback', 
  passport.authenticate('strava', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

//
app.get('/logout', function(req, res){
  req.logout();
});

app.use(function(req,res,next){
  return next(new NotFoundError());
});

module.exports = app;