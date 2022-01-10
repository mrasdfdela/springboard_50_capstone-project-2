// Shared configurations for application
"use strict";

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY || "bed-bath-and-way-beyond";

// declare database environment variables for test vs. prod environments
const PORT = +process.env.PORT || 3001;
function getDatabaseUri(){
  return process.env.NODE_ENV === "test"
    ? "my_strava_test"
    : process.env.DATABASE_URL || "my_strava";
}

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const YOUR_ACCESS_TOKEN = process.env.YOUR_ACCESS_TOKEN;
const frontendUri = process.env.frontendUri || `http://localhost:3000`;

// Sets bcrtypt factor slow to speed up in testing environment
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  BCRYPT_WORK_FACTOR,
  PORT,
  SECRET_KEY,
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  YOUR_ACCESS_TOKEN,
  getDatabaseUri,
  frontendUri
};