const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

let user1 = {
  username: "u1",
  password: "password1",
  first_name: "U1F",
  last_name: "U1L",
  email: "u1@email.com",
  athlete_id: "5468108",
};

let user2 = {
  username: "u2",
  password: "password2",
  first_name: "U2F",
  last_name: "U2L",
  email: "u2@email.com",
  athlete_id: "NULL",
};

const oldActivity = {
  activity_id: "000000001",
  athlete_id: "5468108",
  start_date: new Date("11/29/2021 00:00:00"),
  type: "Ride",
  distance: "29000.0",
  kilojoules: "650.0",
  moving_time: 3630,
  description: "Morning Ride",
  trainer: true,
};

const oldBike = {
  bikeid: "b1913033",
  athleteid: "5468108",
  distance: 20000000,
  brand: "CAAD 10",
  model: "CAAD 10",
  desc: "CAAD 10",
};

const oldGoal = {
  username: "u1",
  distance: "30578.0",
  kilojoules: "603.0",
  time: parseInt("3480"),
  startdt: new Date("01/01/1970 00:00:00"),
  enddt: new Date("01/08/1970 00:00:00"),
};

async function commonBeforeAll(){
  await db.query("DELETE FROM bikes");
  await db.query("DELETE FROM activities");
  await db.query("DELETE FROM goals");
  await db.query("DELETE FROM users");

  user1.password = await bcrypt.hash(user1.password, BCRYPT_WORK_FACTOR);
  user2.password = await bcrypt.hash(user2.password, BCRYPT_WORK_FACTOR);
  let user1Args = Object.values(user1);
  let user2Args = Object.values(user2);  

  await db.query(
    `INSERT INTO users 
      (username, password, first_name, last_name, email, athlete_id)
    VALUES 
      ($1, $2, $3, $4, $5, $6),
      ($7, $8, $9, $10, $11, $12)
    RETURNING username`,
    [...user1Args, ...user2Args]
  );
  
  const [username,distance,kilojoules,movingTime,startDt,endDt] = 
    [
      "u1", 
      "30578", 
      "603", 
      "3480",
      new Date("01/01/1970 00:00:00"),
      new Date("01/08/1970 00:00:00")
    ];

  await db.query(
    `INSERT INTO goals
      (username, distance, kilojoules, moving_time, start_date, end_date)
    VALUES
      ($1, $2, $3, $4, $5, $6)`,
      [username, distance, kilojoules, movingTime, startDt, endDt]
  );

  const [bike_id,athlete_id,bike_distance,brand_name,model_name,bike_description,] = 
    ["b1913033","5468108",20000000,"CAAD 10","CAAD 10","CAAD 10"];
  await db.query(
    `INSERT INTO bikes
      (bike_id, athlete_id, distance, brand_name, model_name, bike_description)
    VALUES
      ($1,$2,$3,$4,$5,$6)`,
    [
      bike_id,
      athlete_id,
      bike_distance,
      brand_name,
      model_name,
      bike_description,
    ]
  );

  const activityArgs = Object.values(oldActivity);
  await db.query(
    `INSERT INTO activities
      (activity_id, athlete_id, start_date, type, distance, kilojoules, moving_time, description, trainer)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [...activityArgs]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  user1, user2,
  oldActivity,
  oldBike,
  oldGoal,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};