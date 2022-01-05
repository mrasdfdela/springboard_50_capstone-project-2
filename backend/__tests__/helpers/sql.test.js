// tests output for helper method method sqlForPartialUpdate

const { sqlForPartialUpdate } = require("../../helpers/sql");

describe("sqlForPartialUpdate", function () {
  test("works when inserting 1 query item", function () {
    const result = sqlForPartialUpdate(
      { f1: "v1" }, 
      { f1: "f1", fF2: "f2" });
    expect(result).toEqual({
      setCols: '"f1"=$1',
      values: ["v1"] });
  });

  test("works when inserting 2 query items", function () {
    const result = sqlForPartialUpdate(
      { f1: "v1", jsF2: "v2" },
      { jsF2: "f2" });
    expect(result).toEqual({
      setCols: '"f1"=$1, "f2"=$2',
      values: ["v1", "v2"] });
  });
});