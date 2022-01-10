// Express app for jerrystravacapstone
"user strict";

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const actRoutes = require("./routes/activities");
const bikeRoutes = require("./routes/bikes");
const goalRoutes = require("./routes/goals");

app.use(authenticateJWT);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Runs express routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/activities", actRoutes);
app.use("/bikes", bikeRoutes);
app.use("/goals", goalRoutes);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.get('/logout', function(req, res){
  req.logout();
});

// Handles 404 error; matches all (up to this point unmatched) routes
app.use(function(req,res,next){
  return next(new NotFoundError());
});

module.exports = app;