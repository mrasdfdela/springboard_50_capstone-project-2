// Tests for bikes routes
"use strict";

const request = require("supertest");
const db = require("../../db.js");
const app = require("../../app");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../../expressError");

const {
  user1,
  user2,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

const oldBike = {
  bikeid: "b1913033",
  athleteid: "5468108",
  distance: 20000000,
  brand: "CAAD 10",
  model: "CAAD 10",
  desc: "CAAD 10",
};
const newBike = {
  bikeid: "b4311939",
  athleteid: "5468108",
  distance: 10000000,
  brand: "Masi CX",
  model: "Masi CX",
  desc: "Masi CX",
};

beforeAll(commonBeforeAll);
beforeEach(async () => {
  commonBeforeEach();
  // Setup an "old" bike before running tests
  const bikeArgs = Object.values(oldBike);
  await db.query(
    `INSERT INTO bikes
    (bike_id, athlete_id, distance, brand_name, model_name, bike_description)
  VALUES
    ($1,$2,$3,$4,$5,$6)`,
    [...bikeArgs]
  );
});
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /bikes", function () {
  test("creates a new bike", async function () {
    const resp = await request(app)
      .post(`/bikes`)
      .send({
        id: newBike.athleteid,
        bikes: [
          {
            id: newBike.bikeid,
            distance: newBike.distance,
            name: newBike.brand,
            nickname: newBike.desc,
          },
        ],
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({ new_bike_records: 1 });
  });
});

describe("GET /bikes/:bike_id", function () {
  test("returns bike by id", async function () {
    const resp = await request(app).get(`/bikes/${oldBike.bikeid}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ bikes: oldBike });
  });
});

describe("GET /bikes/:athlete_id", function () {
  test("returns bike by athlete id", async function () {
    const resp = await request(app)
      .get(`/bikes/`)
      .send({
        athleteId: user1.athlete_id,
        startDt: new Date("01/01/1970 00:00:00"),
        endDt: new Date(),
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      bikes: [oldBike],
    });
  });
  test("returns nothing if no bikes associated with athlete id", async function () {
    const resp = await request(app)
      .get(`/bikes/`)
      .send({
        athleteId: user2.athlete_id,
        startDt: new Date("01/01/1970 00:00:00"),
        endDt: new Date(),
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ bikes: [] });
  });
});

describe("DELETE /bikes/:bike_id", function () {
  test("deletes a bike", async function () {
    const resp = await request(app).delete(`/bikes/${oldBike.bikeid}`);
    expect(resp.statusCode).toEqual(204);
  });
});
