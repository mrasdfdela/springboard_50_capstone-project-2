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
  u1Token, u2Token,
  oldBike,
  oldGoal,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon.js");

const { secondsToTime, kjToCal } = require("../helpers/conversions.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /users/:username", function () {
  test("returns user info by username", async function () {
    const resp = await request(app)
      .get(`/users/${user1.username}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user).toEqual({
      username:user1.username,
      firstName:user1.first_name,
      lastName:user1.last_name,
      email: user1.email,
      athlete_id: user1.athlete_id
    })
  });
});

describe("GET /users/:username/bikes", function () {
  test("gets all user's bikes", async function () {
    const resp = await request(app)
      .get(`/users/${user1.username}/bikes`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.bikes[0]).toEqual(oldBike);
  });
});

describe("GET /users/:username/goals", function () {
  test("gets all user's goals", async function () {
    const resp = await request(app)
      .get(`/users/${user1.username}/goals`)
      .query({ count: 5, page: 1 });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.goals[0]).toEqual({
      username: oldGoal.username,
      goalid: expect.any(Number),
      distance: oldGoal.distance,
      calories: kjToCal(oldGoal.kilojoules),
      kilojoules: oldGoal.kilojoules,
      startdt: oldGoal.startdt.toISOString(),
      enddt: oldGoal.enddt.toISOString(),
      miles: expect.any(Number),
      time: secondsToTime(oldGoal.time),
    });
  });
});

describe("GET /users/:username/goal-count", function () {
  test("returns a count of user's goals", async function () {
    const resp = await request(app)
      .get(`/users/${user1.username}/goals-count`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ count: "1" })
  });
});

describe("GET /users/:username/details", function () {
  test("returns user details", async function () {
    const resp = await request(app)
      .get(`/users/${user1.username}/details`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user).toEqual({
      username: user1.username,
      firstName: user1.first_name,
      lastName: user1.last_name,
      email: user1.email,
      athlete_id: user1.athlete_id,
      last_refresh: expect.any(Object),
      strava_auth_code: expect.any(Object),
      strava_access_token: expect.any(Object),
      strava_refresh_token: expect.any(Object),
    });
  });
});

describe("PATCH /users/:username", function () {
  test("updates user's name", async function () {
    const resp = await request(app)
      .patch(`/users/${user1.username}`)
      .set("authorization", `Bearer ${u1Token}`)
      .send({
        firstName: "Jebron",
        lastName: "Lames",
        password: "password1",
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.user).toEqual({
      username: user1.username,
      firstName: "Jebron",
      lastName: "Lames",
      email: user1.email
    })
  });
});
