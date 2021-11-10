"user strict";

const express = require("express");
const bodyParser = require("body-parser");
// const { response } = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded( {extended: true} ));

const { NotFoundError } = require("./expressError");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
// const actRoutes = require("./routes/activities");
// const goalRoutes = require("./routes/goals");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// app.use("/activities", actRoutes);
// app.use("/goals", goalRoutes);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

//
app.get('/logout', function(req, res){
  req.logout();
});

app.use(function(req,res,next){
  return next(new NotFoundError());
});

module.exports = app;