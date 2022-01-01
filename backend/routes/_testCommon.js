"use strict";
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

const db = require("../db.js");
const { createToken } = require("../helpers/tokens");
const User = require("../models/user");

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
const u1Token = createToken(user1);
const u2Token = createToken(user2);

async function commonBeforeAll() {
  await db.query("DELETE FROM bikes;");
  await db.query("DELETE FROM goals;");
  await db.query("DELETE FROM activities;");
  await db.query("DELETE FROM users;");

  await User.register({
    username: user1.username,
    firstName: user1.first_name,
    lastName: user1.last_name,
    email: user1.email,
    password: user1.password,
  });
  await db.query(`UPDATE users SET athlete_id = $1`, [user1.athlete_id])
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
  u1Token, u2Token,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};
