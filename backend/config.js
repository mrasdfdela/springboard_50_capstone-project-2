"use strict";

const SECRET_KEY = process.env.SECRET_KEY || "bed-bath-and-way-beyond";

const PORT = +process.env.PORT || 3001;
function getDatabaseUri(){
  return process.env.NODE_ENV === "test"
    ? "my_strava_test"
    : process.env.DATABASE_URL || "my_strava";
}

const STRAVA_CLIENT_ID = 73357;
const STRAVA_CLIENT_SECRET = "8c1b9a9e093abe7dc39c6d34e4230f9244783c86 ";

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = { 
  BCRYPT_WORK_FACTOR, 
  PORT,
  SECRET_KEY,
  STRAVA_CLIENT_ID, 
  STRAVA_CLIENT_SECRET,
  getDatabaseUri
};