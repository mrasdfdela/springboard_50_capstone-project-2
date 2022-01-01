"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Goal = require("./goal.js");

const oldGoal = {
  username: "u1",
  distance: "30578.0",
  kilojoules: "603.0",
  time: parseInt("3480"),
  startdt: new Date("01/01/1970 00:00:00"),
  enddt: new Date("01/08/1970 00:00:00"),
};
const newGoal = {
  username: "u1",
  distance: "48280.0",
  kilojoules: "1044.0",
  time: parseInt(4000),
  startdt: new Date("12/01/2021 00:00:00"),
  enddt: new Date("12/08/2021 00:00:00"),
};

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll( async ()=> {
  await commonBeforeAll();
  await db.query(
    `INSERT INTO goals
      (username, distance, kilojoules, moving_time, start_date, end_date)
    VALUES
      ($1, $2, $3, $4, $5, $6)`,
    Object.values(oldGoal)
  );
});
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Goal.new", function () {
  test("creates new goals", async function () {
    let args = Object.values(newGoal);
    let res = await Goal.new(...args);
    expect(res).toEqual(newGoal);
  });

  test("creates new goals without kilojoules or time", async function () {
    newGoal.kilojoules = 0;
    newGoal.time = 0;
    let args = Object.values(newGoal);
    let res = await Goal.new(...args);
    expect(res).toEqual({
      username: newGoal.username,
      distance: newGoal.distance,
      kilojoules: "0.0",
      time: 0,
      startdt: newGoal.startdt,
      enddt: newGoal.enddt,
    });
  });
});

describe("Goal.goalCount", function () {
  test("gets the current goal count", async function () {
    let noGoalRes = await Goal.getUserGoalCount(oldGoal.username);
    expect(noGoalRes.count).toEqual("1");
  });
  test("adds a goal and gets new goal count", async function() {
    let args = Object.values(newGoal);
    await Goal.new(...args);
    let goalRes = await Goal.getUserGoalCount(oldGoal.username);
    expect(goalRes.count).toEqual("2");
  });
});

describe("Goal.getUserGoals & Goal.getById", function () {
  const expectedGoal = {
    goalid: expect.any(Number),
    ...oldGoal,
  };
  test("gets all user goals & uses a goal id to query a goal by ID", async function () {
    const goalRes = await Goal.getUserGoals("u1", 3, 0);
    expect(goalRes.length).toEqual(1);
    expect(goalRes[0]).toEqual(expectedGoal);

    const goalByIdRes = await Goal.getById(goalRes[0].goalid);
    expect(goalByIdRes).toEqual(expectedGoal);
  });
});

describe("Goal.update", function () {
  let updatedGoalRes;
  let goalId;
  test("Updates distance of an existing goal", async function () {
    const goalRes = await Goal.getUserGoals("u1",3,0);
    goalId = goalRes[0].goalid;
    updatedGoalRes = await Goal.update(
      goalId, { distance: "35000.0" } );
    expect(updatedGoalRes).toEqual({
      goalid: expect.any(Number),
      ...oldGoal, distance: "35000.0" });
  });
  test("Updates kilojoules of an existing goal", async function () {
    updatedGoalRes = await Goal.update(
      goalId, { kilojoules: "650.0"} );
    expect(updatedGoalRes).toEqual({
      goalid: expect.any(Number),
      ...oldGoal, kilojoules: "650.0"});
  });
  test("Updates moving time of an existing goal", async function () {
    updatedGoalRes = await Goal.update(
      goalId, { moving_time: 4000} );
    expect(updatedGoalRes).toEqual({
      goalid: expect.any(Number),
      ...oldGoal, time: 4000 });
  });
});

describe("Goal.remove", function () {
  test("removes the user goal", async function () {
    const goalRes = await Goal.getUserGoals("u1", 2, 0);
    const goalId = goalRes[0].goalid;
    const deleteRes = await Goal.remove(goalId);
    expect(deleteRes.goal_id).toEqual(goalId);
  });

  test("throws error if goalId does not exist", async function () {
    try {
      await Goal.remove(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});