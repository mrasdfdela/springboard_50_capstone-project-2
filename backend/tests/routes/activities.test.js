"use strict";
const request = require("supertest");
const db = require("../../db.js");
const app = require("../../app");

const {
  NotFoundError, BadRequestError, UnauthorizedError,
} = require("../../expressError");

const {
  user1, user2,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

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
const newActivity = {
  id: "000000002",
  athlete: { id: "5468108" },
  start_date: new Date("12/01/2021 00:00:00"),
  type: "Ride",
  distance: "30000.0",
  kilojoules: "700.0",
  moving_time: 3900,
  name: "Morning Ride",
  trainer: false,
};

beforeAll(commonBeforeAll);
beforeEach(async ()=> {
  commonBeforeEach();
  const activityArgs = Object.values(oldActivity);
  await db.query(
    `INSERT INTO activities
    (activity_id, athlete_id, start_date, type, distance, kilojoules, moving_time, description, trainer)
  VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [...activityArgs]
  );
});
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /activities", function () {
  test("creates an activity", async function(){
    const resp = await request(app)
      .post("/activities")
      .send([newActivity])
      // .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ new_records: 1 });
  });
});

describe("GET /activities", function () {
  test("returns user's activities", async function(){
    const resp = await request(app)
      .get("/activities")
      .query({
        athleteId: user1.athlete_id,
        count: 5,
        page: 1
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body.activities).toEqual([{
      activityid: oldActivity.activity_id,
      athleteid: oldActivity.athlete_id,
      calories: expect.any(Number),
      date: expect.any(String),
      description: oldActivity.description,
      kilojoules: oldActivity.kilojoules,
      meters: oldActivity.distance,
      miles: expect.any(Number),
      time: expect.any(String),
      trainer: oldActivity.trainer,
      type: oldActivity.type
    }
]);
  });
});

describe("GET /activities/count", function () {
  test("returns activity count of user1 --> 1", async function () {
    const resp = await request(app)
      .get("/activities/count")
      .query({ athleteId: user1.athlete_id });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ count: "1" });
  });
  test("gets activity count of user2 --> 0", async function(){
    const resp = await request(app)
      .get("/activities/count")
      .query({ athleteId: user2.athlete_id})
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ count: "0" });
  });
});

describe("GET /activities/:activity_id", function () {
  test("returns an activity by id", async function () {
    const resp = await request(app)
      .get(`/activities/${oldActivity.activity_id}`)
    expect(resp.statusCode).toEqual(200);

    expect(resp.body.activities).toEqual({
      activity_id: oldActivity.activity_id,
      athlete_id: oldActivity.athlete_id,
      type: oldActivity.type,
      distance: oldActivity.distance,
      kilojoules: oldActivity.kilojoules,
      moving_time: oldActivity.moving_time,
      description: oldActivity.description,
      start_date: expect.any(String),
      calories: expect.any(Number),
      miles: expect.any(Number),
      time: expect.any(String),
    });
  });
});

describe("DELETE /activities/:activity_id", function () {
  test("deletes an activity", async function(){
    const resp = await request(app)
      .delete(`/activities/${oldActivity.activity_id}`);
    expect(resp.statusCode).toEqual(204);
  });
});