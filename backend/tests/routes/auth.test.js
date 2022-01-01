"use strict";

const request = require("supertest");
const app = require("../../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /auth/register", function () {
  test("works for anon", async function () {
    const resp = await request(app)
    .post("/auth/register")
    .send({
      username: "newUser",
      firstName: "newFirst",
      lastName: "newLast",
      password: "newPassword",
      email: "newUser@email.com",
    });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "new",
    });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app).post("/auth/register").send({
      username: "new",
      firstName: "first",
      lastName: "last",
      password: "password",
      email: "not-an-email",
    });
    expect(resp.statusCode).toEqual(400);
  });
});
