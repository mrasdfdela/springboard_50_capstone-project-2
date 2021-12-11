import axios from "axios";
const BASE_URL = "http://localhost:3001";
const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require("../config");


class MyStravaApi {
  static token;

  // setup endpoint template
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    // pass in an authorization token via the header
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      console.error("Testing Error:", err);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Register User **/
  static async registerUser({
    username,
    firstName,
    lastName,
    password,
    email,
  }) {
    console.log("api: registerUser");
    const userInfo = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      password: password,
      email: email,
    };
    let res = await this.request(`auth/register`, userInfo, "post");
    this.token = res.token;
    return this.token;
  }
  // Login
  static async authenticateUser(username, password) {
    const credentials = { username: username, password: password };
    let res = await this.request(`auth/token`, credentials, "post");
    this.token = res.token;
    return res.token;
  }
  // Get user info
  static async getUser(user) {
    let res = await this.request(`users/${user}`);
    let { username, firstName, lastName, email, athlete_id } = res.user;
    return {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      athlete_id: athlete_id,
    };
  }
  // Patch user info
  static async patchUser(formData) {
    try {
      const token = await this.authenticateUser(
        formData.username,
        formData.password
      );
      console.log(formData);
      if (typeof token === "string") {
        const userInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          newPassword: formData.newPassword,
        };
        let res = await this.request(
          `users/${formData.username}`,
          userInfo,
          "patch"
        );
        return res.user;
      }
    } catch (err) {
      return err;
    }
  }

  // Connect user to Strava
  // Redirects to Strava login site to authorize sharing user data
  // After authorization, strava redirects to backend endpoint auth/strava/callback
  // Save strava user auth code, which will be used to request access and refresh tokens
  static async connectToStravaFrontEndApi(username) {
    const respType = "code";
    const redirectUri =
      "http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fstrava%2Fcallback";
    const scope = "profile%3Aread_all,activity%3Aread_all";
    window.location = `https://www.strava.com/oauth/authorize?response_type=${respType}&redirect_uri=${redirectUri}&scope=${scope}&state=${username}&client_id=${STRAVA_CLIENT_ID}`;
  }

  // Requests access and refresh tokens from strava
  // Retrieves user's auth code
  // Makes post request to retrieve access token, refresh token, and athlete id
  // Subsequently saves token to user
  static async retrieveStravaTokens(username) {
    try {
      const userRes = await this.request(`users/${username}/details`);
      const code = userRes.user.strava_auth_code;
      const prevToken = userRes.user.strava_access_token;

      // retrieve strava user info, including refresh token, access token, and athlete id
      // window.location = `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`
      const codeRes = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`
      );
      const stravaDetails = {
        username: userRes.user.username,
        refresh_token: codeRes.data.refresh_token,
        access_token: codeRes.data.access_token,
        athlete_id: codeRes.data.athlete.id,
      };

      // updates user with token and athlete id
      const updatedUser = await this.request(
        "auth/strava/tokens",
        stravaDetails,
        "post"
      );
      console.log(`Tokens updated for user: '${updatedUser.username}`);
      if (!prevToken) {
        console.log(`Downloading data for: '${updatedUser.username}`);
        await this.getUserActivities(updatedUser.username);
      }
    } catch (err) {
      return err;
    }
  }

  static async refreshAccessToken(username) {
    try {
      const grantType = "refresh_token";
      const userRes = await this.request(`users/${username}/details`);
      // console.log(userRes);
      const athleteId = userRes.user.athlete_id;
      const refreshToken = userRes.user.strava_refresh_token;

      const refRes = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=${grantType}&refresh_token=${refreshToken}`
      );
      // console.log(`refRes:`);
      // console.log(refRes);

      const stravaDetails = {
        username: username,
        athlete_id: athleteId,
        refresh_token: refreshToken,
        access_token: refRes.data.access_token,
      };
      // console.log(stravaDetails);

      // updates user access token
      const updatedUser = await this.request(
        "auth/strava/tokens",
        stravaDetails,
        "post"
      );
      console.log(`Tokens updated for user: '${updatedUser.username}`);
    } catch (err) {
      return err;
    }
  }

  static async getUserAccessToken(username) {
    const res = await this.request(`users/${username}/details`);
    return res.user.strava_access_token;
  }

  // Get all user activities; called after first time connecting strava account
  static async stravaGetUserActivities(username) {
    try {
      const accessToken = await this.getUserAccessToken(username);
      let activitiesData = [""];
      let page = 1;
      let per_page = 50;

      while (activitiesData.length > 0) {
        console.log(`Page: ${page}`);
        const res = await axios.get(
          `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}&page=${page}&per_page=${per_page}`
        );

        if (res.data.length > 0) {
          activitiesData = res.data;
          const activityRes = await this.request(
            `activities`,
            activitiesData,
            "post"
          );
          console.log(activityRes);
          page += 1;
        } else {
          activitiesData = [];
        }
      }
      return;
    } catch (err) {
      return err;
    }
  }

  static async stravaGetUserBikes(username) {
    try {
      const accessToken = await this.getUserAccessToken(username);
      const res = await axios.get(
        `https://www.strava.com/api/v3/athlete?access_token=${accessToken}`
      );
      const numBikes = res.data.bikes.length;

      if (numBikes > 0) {
        const bikeRes = await this.request(`bikes`, res.data, "post");
        console.log(bikeRes);
      }
    } catch (err) {
      return err;
    }
  }

  // get bike by id
  static async getBike(bikeId) {
    try {
      const res = await this.request(`bikes/${bikeId}`);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // get user's bikes
  static async getUserBikes(username) {
    try {
      const res = await this.request(`users/${username}/bikes`);
      return res.data;
    } catch (err) {
      return err;
    }
  }

  // set goal
  static async addGoal(username, formData) {
    try {
      formData.username = username;
      let res = await this.request('goals', formData, "post");
      return res.data;
    } catch(err) {
      return err;
    }
  }

  // get goal by id
  static async getGoal(goalId) {
    try {
      const res = await this.request(`goals/${goalId}`);
      return res.displayGoal;
    } catch (err) {
      return err;
    }
  }

  // get goals by username
  static async getUserGoals(username) {
    try {
      const res = await this.request(`users/${username}/goals`);
      return res;
    } catch (err) {
      return err;
    }
  }

  // update goal by id
  static async updateGoal(goalId, formData) {
    try {
      const res = await this.request(`goals/${goalId}`, formData, "patch");
      return res.data;
    } catch (err) {
      return err;
    }
  }
  
  // delete goal by id
  static async removeGoal(goalId){
    try {
      const res = await this.request(`goals/${goalId}`, {}, "delete");
      return res;
    } catch(err) {
      return err;
    }
  }
}

export default MyStravaApi;