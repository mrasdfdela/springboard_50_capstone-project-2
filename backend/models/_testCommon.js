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