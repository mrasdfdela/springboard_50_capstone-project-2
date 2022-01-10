/** Database setup for my-strava. */
"use strict";
// Setup PostgreSQL database
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

// Select between production and test database on startup
if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri(),
  });
}


db.connect();
module.exports = db;