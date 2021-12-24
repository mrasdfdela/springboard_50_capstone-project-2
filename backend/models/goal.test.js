"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Goal = require("./goal.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** register */
describe("new", function () {
  const [username, distance, kilojoules, movingTime, startDt, endDt] = [
    "u1",
    "48280",
    "1044",
    "4000",
    new Date("12/01/2021 00:00:00"),
    new Date("12/08/2021 00:00:00"),
  ];

    test("works", async function () {
    let res = await Goal.new(username, distance, kilojoules, movingTime, startDt, endDt);
    expect(res).toEqual({
      username: username,
      distance: "48280.0",
      kilojoules: "1044.0",
      time: parseInt(movingTime),
      startdt: startDt,
      enddt: endDt,
    });
  });

  test("works without kilojoules or time", async function () {
    let res = await Goal.new(
      username,
      distance,
      0,
      0,
      startDt,
      endDt
    );
    expect(res).toEqual({
      username: username,
      distance: "48280.0",
      kilojoules: "0.0",
      time: 0,
      startdt: startDt,
      enddt: endDt,
    });
  });
});

// // ************************************** Goal Count */
describe("goalCount", function () {
    const username = "u1";
    const distance = "30578";
    const kilojoules = "603";
    const movingTime = "3480";
    const startDt = new Date("01/01/1970 00:00:00");
    const endDt = new Date("01/08/1970 00:00:00");

  test("works", async function () {
    let noGoalRes = await Goal.getUserGoalCount(username);
    expect(noGoalRes.count).toEqual("1");
    await Goal.new(username, distance, kilojoules, movingTime, startDt, endDt);
    let goalRes = await Goal.getUserGoalCount(username);
    expect(goalRes.count).toEqual("2");
  });
});

// // ************************************** getUserGoals & getById */

describe("getUserGoals & getById", function () {
  test("works", async function () {
    const goal = {
      goalid: expect.any(Number),
      username: "u1",
      distance: "30578.0",
      kilojoules: "603.0",
      time: 3480,
      startdt: new Date("01/01/1970 00:00:00"),
      enddt: new Date("01/08/1970 00:00:00")};

    const goalRes = await Goal.getUserGoals("u1", 2, 0);
    expect(goalRes[0]).toEqual(goal);
    const goalByIdRes = await Goal.getById(goalRes[0].goalid);
    expect(goalByIdRes).toEqual(goal);
  });
});

// /*********************************** update */

describe("update", function () {
  test("works", async function () {
    const goalRes = await Goal.getUserGoals("u1", 2, 0);
    const goalId = goalRes[0].goalid;
    const updatedGoalRes = await Goal.update(goalId, {
      distance: "32000",
    });
    expect(updatedGoalRes).toEqual({
      goal_id: goalId,
      username: "u1",
      distance: "32000.0",
      kilojoules: "603.0",
      moving_time: 3480,
      start_date: new Date("01/01/1970 00:00:00"),
      end_date: new Date("01/08/1970 00:00:00")});
  });
});

// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    const goalRes = await Goal.getUserGoals("u1", 2, 0);
    const goalId = goalRes[0].goalid;
    const deleteRes = await Goal.remove(goalId);
    expect(deleteRes.goal_id).toEqual(goalId);
  });

  test("not found", async function () {
    try {
      await Goal.remove(-1);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});