const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe ("createToken", function(){
  test("works", function(){
    const token = createToken( {username: "testUser", athlete_id: "a112233"});
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "testUser",
      athlete_id: "a112233"
    });
  });
});