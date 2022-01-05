// Tests users routes
"use strict";

const request = require("supertest");
const db = require("../../db");
const app = require("../../app");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

const {
  calToKj,
  kjToCal,
  metersToMiles,
  milesToMeters,
  calcEndDt,
  datesToTimePeriod,
  timeToSeconds,
  secondsToTime,
} = require("../../helpers/conversions.js");
const {
  user1, user2,
  u1Token, u2Token,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon.js");

const newBike = {
  bikeid: "b4311939",
  athleteid: "5468108",
  distance: 10000000,
  brand: "Masi CX",
  model: "Masi CX",
  desc: "Masi CX",
};
const newGoal = {
  calories: "655.0",
  date: new Date(),
  miles: "18.5",
  time: "1:00",
  timePeriod: "week",
  username: user1.username,
};


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
    await request(app).post("/bikes").send({
      id: newBike.athleteid,
      bikes:[{
            id: newBike.bikeid,
            distance: newBike.distance,
            name: newBike.brand,
            nickname: newBike.desc }]
    });
    
    const resp = await request(app)
      .get(`/users/${user1.username}/bikes`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.bikes[0]).toEqual(newBike);
  });
});

describe("GET /users/:username/goals", function () {
  test("gets all user's goals", async function () {
    await request(app).post("/goals").send(newGoal);
    
    const today = new Date(
        newGoal.date.getUTCFullYear(),
        newGoal.date.getUTCMonth(),
        newGoal.date.getUTCDate()
      )
    const offset = today.getTimezoneOffset()
    const resp = await request(app)
      .get(`/users/${user1.username}/goals`)
      .query({ count: 5, page: 1 });
    expect(resp.statusCode).toEqual(200);

    expect(resp.body.goals[0]).toEqual({
      goalid: expect.any(Number),
      username: user1.username,
      distance: "29772.0",
      kilojoules: "651.0",
      time: "01:00",
      startdt: today.toISOString(),
      enddt: expect.any(String), 
        // (
        //   new Date(calcEndDt(today, newGoal.timePeriod))
        // ).timezone,
      miles: 18.5,
      calories: 654.3,
    });
  });
});

describe("GET /users/:username/goal-count", function () {
  test("returns a count of user's goals --> 0", async function () {
    const resp = await request(app)
      .get(`/users/${user1.username}/goals-count`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ count: "0" })
  });
  test("returns a count of user's goals --> 1", async function () {
    await request(app).post("/goals").send(newGoal);

    const resp = await request(app)
      .get(`/users/${user1.username}/goals-count`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ count: "1" })
  });
});

describe("GET /users/:username/details", function () {
  test("returns user's details", async function () {
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
