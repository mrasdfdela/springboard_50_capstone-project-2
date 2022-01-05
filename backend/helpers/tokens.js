/** return signed JWT from user data. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

function createToken(user) {
  let payload = {
    username: user.username,
    athlete_id: user.athlete_id
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
