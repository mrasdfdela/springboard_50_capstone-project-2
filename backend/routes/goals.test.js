"use strict";
const request = require("supertest");
const app = require("../app");

const {
  calToKj,
  milesToMeters,
  calcEndDt,
  timeToSeconds
} = require("../helpers/conversions");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Goal = require("../models/goal.js");
const User = require("../models/user.js");

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

const newGoal = {
  calories: "655.0",
  date: new Date(),
  miles: "18.5",
  time: "1:00",
  timePeriod: "week",
  username: "u1",
};

describe("POST /goals", function () {
  test("creates a new goal", async function () {
     const resp = await request(app)
      .post('/goals')
      .send(newGoal)
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.goal).toEqual({
      username: newGoal.username,
      distance: "29772.0",
      kilojoules: "651.0",
      time: timeToSeconds(newGoal.time),
      startdt: expect.any(String),
      enddt: expect.any(String),
    });
  });

  test("creates a new distance goal only", async function () {
     const resp = await request(app)
      .post('/goals')
      .send({
        username: newGoal.username,
        miles: newGoal.miles,
        time: "0",
        calories: "0",
        timePeriod: "week", 
        date: new Date(),
      })
    expect(resp.statusCode).toEqual(201);
    expect(resp.body.goal).toEqual({
      username: newGoal.username,
      distance: "29772.0",
      kilojoules: "0.0",
      time: 0,
      startdt: expect.any(String),
      enddt: expect.any(String),
    });
  });
});

describe("GET /goals/:goal_id", function () {
  test("returns a goal by id", async function () {
    const userGoals = await request(app)
      .get(`/users/${oldGoal.username}/goals`)
      .query({ count: 5, page: 1 });
    const goalId = userGoals.body.goals[0].goalid;
    const goalRes = await request(app).get(`/goals/${goalId}`);
    expect(goalRes.statusCode).toEqual(200);
    expect(goalRes.body.displayGoal).toEqual({
      goalId: expect.any(Number),
      miles: 19,
      calories: 606,
      time: "00:58",
      timePeriod: "week",
      startdt: "1970-01-01",
      enddt: "1970-01-08",
    });
  });
});

describe("PATCH /goals/goals_id", function () {
  test("updates goal by id", async function () {
    const userGoals = await request(app)
      .get(`/users/${oldGoal.username}/goals`)
      .query({ count: 5, page: 1 });
    const goalId = userGoals.body.goals[0].goalid;
    const updatedGoal = await request(app)
      .patch(`/goals/${goalId}`)
      .send({ ...newGoal, startdt: newGoal.date });
    expect(updatedGoal.statusCode).toEqual(200);
    expect(updatedGoal.body.newGoal).toEqual({
      goalid: goalId,
      username: newGoal.username,
      distance: "28968.1",
      kilojoules: "651.7",
      time: timeToSeconds(newGoal.time),
      startdt: expect.any(String),
      enddt: expect.any(String),
    });
  });
});

describe("DELETE /goals/:goal_id", function () {
  test("deletes goal by id", async function () {  
    const userGoals = await request(app)
    .get(`/users/${oldGoal.username}/goals`)
    .query({ count: 5, page: 1 });
  const goalId = userGoals.body.goals[0].goalid;
  const resp = await request(app)
    .delete(`/goals/${goalId}`)
  expect(resp.statusCode).toEqual(204);
  });
});
