// Tests for the the Activity model
"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");
const db = require("../../db.js");
const Activity = require("../../models/activity.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { fail } = require("assert");

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
  activity_id: "000000002",
  athlete_id: "5468108",
  start_date: new Date("12/01/2021 00:00:00"),
  type: "Ride",
  distance: "30000.0",
  kilojoules: "700.0",
  moving_time: 3900,
  description: "Morning Ride",
  trainer: false,
};

beforeAll( async ()=>{
  await commonBeforeAll();
  // Setup an "old" activity before running tests
  await db.query(
    `INSERT INTO activities
      (activity_id, athlete_id, start_date, type, distance, kilojoules, moving_time, description, trainer)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    Object.values(oldActivity)
  );
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Activity.new", function () {
  test("creates a new activity", async function(){
    const args = Object.values(newActivity);
    let res = await Activity.new(...args);
    expect(res).toEqual(newActivity);
  })
});

describe("Activity.activityExists", function () {
  test("checks if activity exists --> true", async function(){
    const actRes = await Activity.activityExists(oldActivity.activity_id);
    expect(actRes.exists).toEqual(true);
  });

  test("checks if activity exists --> false", async function(){
    const actRes = await Activity.activityExists("12345");
    expect(actRes.exists).toEqual(false);
  });
});

describe("Activity.getCount", function () {
  test("returns the activity count for a userId", async function () {
    const cntRes = await Activity.getCount(oldActivity.athlete_id);
    expect(parseInt(cntRes.count)).toEqual(1);
  });

  test("creates new activity & check activity count for a userId", async function () {
    const args = Object.values(newActivity);
    await Activity.new(...args);
    const cntRes = await Activity.getCount(oldActivity.athlete_id);
    expect(parseInt(cntRes.count)).toEqual(2);
  });

});
describe("Activity.getById", function () {
  test("gets an activity by ID", async function() {
    const res = await Activity.getById(oldActivity.activity_id);
    expect({ ...res, trainer: true }).toEqual(oldActivity);
  });

  test("returns error when searching for invalid activityId", async function() {
    try {
      const res = await Activity.getById("12345");
      fail();
    } catch(err) {
      expect(err instanceof NotFoundError);
    }
  });
});

// describe("Activity.getByDates", function () {
//   no tests; my_strava app does not search using dates
// });

describe("Activity.getByAthlete", function () {
  test("gets all athlete activities", async function(){
    const res = await Activity.getByAthlete(oldActivity.athlete_id, 1, 0);
    expect(res.length).toEqual(1);
    expect(res[0]).toEqual({
      activityid: oldActivity.activity_id,
      athleteid: oldActivity.athlete_id,
      date: oldActivity.start_date,
      meters: oldActivity.distance,
      time: oldActivity.moving_time,
      description: oldActivity.description,
      kilojoules: oldActivity.kilojoules,
      trainer: oldActivity.trainer,
      type: oldActivity.type
    });
  });
  
  test("returns empty array when searching for invalid athleteId", async function () {
    const res = await Activity.getByAthlete("12345", 1, 0);
    expect(res.length).toEqual(0);
  });
});

// describe("Activity.update", function () {
  // no tests; my_strava app does not update activities
// });

describe("Activity.remove", function () {
  test("removes activity", async function(){
    const res = await Activity.remove(oldActivity.activity_id);
    expect(res.activity_id).toEqual(oldActivity.activity_id);
  });
});