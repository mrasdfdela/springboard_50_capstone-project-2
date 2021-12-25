const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll(){
  await db.query("DELETE FROM bikes");
  await db.query("DELETE FROM activities");
  await db.query("DELETE FROM goals");
  await db.query("DELETE FROM users");

  await db.query(
    `INSERT INTO users 
      (username, password, first_name, last_name, email, athlete_id)
    VALUES 
      ('u1', $1, 'U1F', 'U1L', 'u1@email.com', $2),
      ('u2', $3, 'U2F', 'U2L', 'u2@email.com', NULL)
    RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      "5468108",
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)
    ]
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
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};