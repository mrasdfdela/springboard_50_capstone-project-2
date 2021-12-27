"use strict";
const User = require("./user.js");
const db = require("../db.js");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const {
  user1, user2,
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

let user3 = {
  username: "uNew",
  firstName: "uNewF",
  lastName: "uNewL",
  email: "uNew@email.com",
};

describe("User.new", function () {
  test("creates a new user", async function () {
    let user = await User.register({...user3, password:"password"});
    const found = await db.query(
      `SELECT * FROM users 
      WHERE username = '${user3.username}'`);
    expect(user).toEqual({ ...user3 });
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({ ...user3, password: "password" });
      await User.register({ ...user3, password: "otherPwd" });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("User.authenticate", function () {
  test("authenticates user & password", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: user1.username,
      firstName: user1.first_name,
      lastName: user1.last_name,
      email: user1.email
    });
  });

  test("denies authentication if no such user", async function () {
    try {
      await User.authenticate("u3", "password3");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("denies authentication if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong_password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

describe("User.findAll", function () {
  test("returns all users in database", async function () {
    const users = await User.findAll();
    expect(users).toEqual(
      [{
        username: user1.username,
        firstName: user1.first_name,
        lastName: user1.last_name,
        email: user1.email,
      }, 
      {
        username: user2.username,
        firstName: user2.first_name,
        lastName: user2.last_name,
        email: user2.email,
      }]);
  });
});

describe("User.get", function () {
  test("returns user information", async function () {
    let user = await User.get(user1.username);
    expect(user).toEqual({
      username: user1.username,
      firstName: user1.first_name,
      lastName: user1.last_name,
      email: user1.email,
      athlete_id: user1.athlete_id
    });
  });

  test("returns an error if user is not found", async function () {
    try {
      await User.get("fakeUser");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("User.getDetails", function () {
  test("returns user details, access code and strava tokens", async function () {
    let user = await User.getDetails(user1.username);
    expect(user).toEqual({
      username: user1.username,
      firstName: user1.first_name,
      lastName: user1.last_name,
      email: user1.email,
      athlete_id: user1.athlete_id,
      strava_auth_code: expect.any(Object),
      strava_access_token: expect.any(Object),
      strava_refresh_token: expect.any(Object),
      last_refresh: expect.any(Object),
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.getDetails("fakeUser");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("User.update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    email: "new@email.com",
  };

  test("updates user information", async function () {
    let job = await User.update(user1.username, updateData);
    expect(job).toEqual({ username: user1.username, ...updateData });
  });

  test("updates user password", async function () {
    let job = await User.update(
      user1.username, {
        password: "password1",
        newPassword: "newPassword1" 
      });
    expect(job).toEqual({
      username: user1.username,
      firstName: user1.first_name,
      lastName: user1.last_name,
      email: user1.email
    });
    const found = await db.query(
      `SELECT * FROM users WHERE username = '${user1.username}'`);
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("returns an error if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("returns another error if no data is passed in", async function () {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

describe("User.remove", function () {
  test("creates, deletes, & confirms user has been removed", async function () {
    const newUser = await User.register({...user3, password: "password" });
    expect(newUser).toEqual({
      username: user3.username,
      firstName: user3.firstName,
      lastName: user3.lastName,
      email: user3.email,
    });
    await User.remove(user3.username);
    try {
      await User.get(user3.username);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("returns an error if no such user", async function () {
    try {
      await User.remove("u3");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});