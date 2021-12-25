"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const Bike = require("./bike.js");
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

/** save new bike */
describe("new", function () {
  const [bikeId, athleteId, distance, brand, model, desc] = 
  ["b1913033","5468108",20000000,"CAAD 10","CAAD 10","CAAD 10"];

  test("works", async function () {
    let res = await Bike.new(bikeId, athleteId, distance, brand, model, desc);
  
    expect(res).toEqual({
      bikeid: "b1913033",
      athleteid: "5468108",
      distance: 20000000,
      brand: "CAAD 10",
      model: "CAAD 10",
      desc: "CAAD 10",
    });
  });
});

// // ************************************** Bike Exists */
describe("bikeExists", function () {
  test("works", async function () {
    const bikeRes = await Bike.bikeExists("b1913033");
    const noBikeRes = await Bike.bikeExists("b12345")
    expect(bikeRes).toEqual(true);
    expect(noBikeRes).toEqual(false);
  });
});

// // ************************************** getById */

describe("getById", function () {
  test("works", async function () {
    const bikeRes = await Bike.getById("b1913033");
    expect(bikeRes).toEqual(newBike);
  });
});

// // ************************************** getByAthleteId */

describe("getByAthleteId", function () {
  test("works", async function () {
    const bikeRes = await Bike.getByAthleteId("5468108");
    expect(bikeRes.length).toEqual(1);
    expect(bikeRes[0]).toEqual(newBike);
  });
});

// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    let bikeRes = await Bike.getByAthleteId("5468108");
    expect(bikeRes.length).toEqual(1);
    
    const removedRes = await Bike.remove("5468108");
    expect(removedRes.bike_id).toEqual("5468108");

    bikeRes = await Bike.getByAthleteId("5468108");
    expect(bikeRes.length).toEqual(0);
  });
});