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

async function commonBeforeAll(){
  await db.query("DELETE FROM bikes;");
  await db.query("DELETE FROM activities;");
  await db.query("DELETE FROM goals;");
  await db.query("DELETE FROM users;");

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
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};