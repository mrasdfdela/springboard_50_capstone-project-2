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
const { fail } = require("assert");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const newBike = {
  bikeid:"b4311939",
  athleteid:"5468108",
  distance:10000000,
  brand:"Masi CX",
  model:"Masi CX",
  desc:"Masi CX"
}

const oldBike = {
  bikeid:"b1913033",
  athleteid:"5468108",
  distance:20000000,
  brand:"CAAD 10",
  model:"CAAD 10",
  desc:"CAAD 10"
}

describe("Test Bike.new", function () {
  test("create & return new bike object", async function () {
    const args = Object.values(newBike)
    let res = await Bike.new(...args);
    expect(res).toEqual(newBike);
  });
});

describe("Test Bike.bikeExists", function () {
  test("returns true when searching for an existing bike", async function () {
    const bikeRes = await Bike.bikeExists(oldBike.bikeid);
    expect(bikeRes).toEqual(true);
  });
  test("returns false when searching for an non-existing bike", async function () {
    const noBikeRes = await Bike.bikeExists(newBike.bikeid);
    expect(noBikeRes).toEqual(false);
  });

});

describe("Test Bike.getById", function () {
  test("returns bike object", async function () {
    const bikeRes = await Bike.getById(oldBike.bikeid);
    expect(bikeRes).toEqual(oldBike);
  });
});

describe("Test Bike.getByAthleteId", function () {
  test("returns an array of athlete's bikes", async function() {
    const bikeRes = await Bike.getByAthleteId(oldBike.athleteid);
    expect(bikeRes.length).toEqual(1);
    expect(bikeRes[0]).toEqual(oldBike);
  });

  test("add a bike and return array of bikes", async function() {
    const args = Object.values(newBike);
    let res = await Bike.new(...args);

    const bikeRes = await Bike.getByAthleteId(oldBike.athleteid);
    expect(bikeRes.length).toEqual(2);
    expect(bikeRes).toEqual([oldBike,newBike]);
  });
});

describe("Test Bike.remove", function () {
  test("first checks if a bike exists", async function () {
    let bikeRes = await Bike.getById(oldBike.bikeid);
    expect(bikeRes).toEqual(oldBike);
  });

  test("removes a bike and re-checks if it exists", async function () {
    const removedRes = await Bike.remove(oldBike.bikeid);
    expect(removedRes.bike_id).toEqual(oldBike.bikeid);

    try {
      bikeRes = await Bike.getById(oldBike.bikeid);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});