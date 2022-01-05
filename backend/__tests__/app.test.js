// tests that app.js functions

const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(function () {
  db.end();
});

describe("test non-existant route 404", function(){
  test("not found for site 404", async function () {
    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);
  });
  
  test("not found for site 404 (test stack print)", async function () {
    process.env.NODE_ENV = "";
    const resp = await request(app).get("/no-such-path");
    expect(resp.statusCode).toEqual(404);
    delete process.env.NODE_ENV;
  });
});