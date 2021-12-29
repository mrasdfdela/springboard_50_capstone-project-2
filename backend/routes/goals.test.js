"use strict";
const request = require("supertest");
const app = require("../app");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Goal = require("../models/goal.js");

const {
  oldGoal,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("../models/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /goals", function () {
  test("goals", async function () {

  });
});

describe("GET /goals/:goal_id", function () {
  test("goals", async function () {

  });
});

describe("PATCH /goals/goals_id", function () {
  test("goals", async function () {

  });
});

describe("DELETE /goals/:goal_id", function () {
  test("goals", async function () {

  });
});
