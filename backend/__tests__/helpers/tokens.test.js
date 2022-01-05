// tests helper method createToken

const jwt = require("jsonwebtoken");
const { createToken } = require("../../helpers/tokens");
const { SECRET_KEY } = require("../../config");

describe ("createToken", function(){
  test("creates a token with correct username/athlete_idd", function(){
    const token = createToken( {username: "testUser", athlete_id: "a112233"});
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "testUser",
      athlete_id: "a112233"
    });
  });
});