"use strict";

require("dotenv").config();
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

module.exports = {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET
};
