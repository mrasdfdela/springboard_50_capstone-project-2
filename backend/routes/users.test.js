"use strict";
const request = require("supertest");
const app = require("../app");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const {
  user1, user2,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /users/:username", function () {
  test("", async function () {
    
  });
});

describe("GET /users/:username/bikes", function () {
  test("", async function () {

  });
});

describe("GET /users/:username/goals", function () {
  test("", async function () {

  });
});

describe("GET /users/:username/goal-count", function () {
  test("", async function () {

  });
});

describe("GET /users/:username/details", function () {
  test("", async function () {

  });
});

describe("PATCH /users/:username", function () {
  test("", async function () {

  });
});
