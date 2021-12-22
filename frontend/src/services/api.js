import axios from "axios";
let { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require("../config");

STRAVA_CLIENT_ID = 
  process.env.REACT_APP_STRAVA_CLIENT_ID || 
  STRAVA_CLIENT_ID;
STRAVA_CLIENT_SECRET =
  process.env.REACT_APP_STRAVA_CLIENT_SECRET || 
  STRAVA_CLIENT_SECRET;
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class MyStravaApi {
  static token;

  /** Endpoint Template */
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
    console.log("api: registerUser, token:")
    console.log(this.token);
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
    try {
      let res = await this.request(`users/${user}`);
      let { username, firstName, lastName, email, athlete_id } = res.user;
      return {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        athlete_id: athlete_id,
      };
    } catch (err) {
      return err;
    }
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
  // Redirects to Strava login site to authorize sharing user data. After authorizing, Strava makes a request to backend endpoint auth/strava/callback (which saves strava user auth code), which then redirects to /strava-startup to refresh tokens & download data
  static async stravaOathCode(username) {
    const respType = "code";
    const redirectUri = encodeURIComponent(`${BASE_URL}/auth/strava/callback`);
    const scope = "profile%3Aread_all,activity%3Aread_all";
    window.location = `https://www.strava.com/oauth/authorize?response_type=${respType}&redirect_uri=${redirectUri}&scope=${scope}&state=${username}&client_id=${STRAVA_CLIENT_ID}`;
  }

  // Requests access and refresh tokens from strava
  // Retrieves user's auth code
  // Makes post request to retrieve access token, refresh token, and athlete id
  // Subsequently saves token to user
  static async stravaTokensExchange(username) {
    try {
      const userRes = await this.request(`users/${username}/details`);
      const authCode = userRes.user.strava_auth_code;
      const token = userRes.user.strava_access_token;

      if (typeof authCode === 'string' && token === null ) {
        // retrieve strava user refresh & access tokens and athlete id
        const codeRes = await axios.post(
          `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${authCode}&grant_type=authorization_code`
        );
        // get current time
        const timeRes = await axios.get(
          `https://worldtimeapi.org/api/timezone/Europe/London`
        );
        const currDate = new Date(timeRes.data.utc_datetime).toUTCString();
  
        const stravaDetails = {
          username: userRes.user.username,
          refresh_token: codeRes.data.refresh_token,
          access_token: codeRes.data.access_token,
          athlete_id: codeRes.data.athlete.id,
          last_refresh: currDate
        };
  
        // updates user with token and athlete id
        const updatedUser = await this.request(
          "auth/strava/tokens", stravaDetails, "post");
        console.log(`Tokens downloaded for user: '${updatedUser.username}`);
        return { tokenDownloaded: true};
      }
      return { tokenDownloaded: false };
    } catch (err) {
      return err;
    }
  }

  static async stravaRefreshAccessToken(username) {
    try {
      const grantType = "refresh_token";
      const userRes = await this.request(`users/${username}/details`);
      const athleteId = userRes.user.athlete_id;
      const refreshToken = userRes.user.strava_refresh_token;

      if (refreshToken){
        // Query to refresh strava auth token
        const refRes = await axios.post(
          `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=${grantType}&refresh_token=${refreshToken}`);

        // Update strava access token
        if (userRes.user.strava_access_token != refRes.data.access_token) {
          const timeRes = await axios.get(
            `https://worldtimeapi.org/api/timezone/Europe/London`);
          const currDate = new Date(timeRes.data.utc_datetime).toUTCString();

          // POST strava auth credentials to database
          const updatedUser = await this.request(
            "auth/strava/tokens",
            { username: username,
              athlete_id: athleteId,
              refresh_token: refreshToken,
              access_token: refRes.data.access_token,
              last_refresh: currDate },
            "post");

          return { msg :`Tokens updated for user: ${username}` };
        } else {
          let expireDt = new Date(userRes.user.last_refresh).toUTCString();
          expireDt.setHours(expireDt.getHours() + 6);
          return { msg:`${username}'s access token is valid until ${expireDt}` }
        }
      }
      return { msg: 'No refresh token available' }
    } catch (err) {
      return err;
    }
  }

  // Queries database for access token
  static async getUserAccessToken(username) {
    const res = await this.request(`users/${username}/details`);
    return res.user.strava_access_token;
  }

  // Get all user activities; called after first time connecting strava account
  static async stravaGetUserActivities(username) {
    try {
      let activitiesData = [""];
      let page = 1;
      let per_page = 30;
      let epochTime = "";
      
      const accessToken = await this.getUserAccessToken(username);
      const lastAct = await this.getUserActivities(username,1,1);
      if (lastAct.length > 0) {
        epochTime = new Date(lastAct[0].date).getTime() / 1000;
      }

      while (activitiesData.length > 0) {
        console.log(`Page: ${page}`);
        const res = await axios.get(
          `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}&page=${page}&per_page=${per_page}&after=${epochTime}`
        );

        if (res.data.length > 0) {
          activitiesData = res.data;
          const activityRes = await this.request(
            `activities`, activitiesData, 'post');
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
      return res.data.bikes;
    } catch (err) {
      return err;
    }
  }

  static async getActivityCount(username) {
    try {
      const user = await this.getUser(username);
      const res = await this.request(
        `activities/count`,
        {athleteId: user.athlete_id});
      return parseInt(res.count);
    } catch (err) {
      return err;
    }
  }

  static async getActivity(activityId) {
    try {
      const res = await this.request(`activities/${activityId}`);
      return res.activities;
    } catch (err) {
      return err;
    }
  }

  static async getUserActivities(username,count=5,page=1) {
    try {
      const user = await this.getUser(username);
      const res = await this.request(
        `activities`,
        { 
          athleteId: user.athlete_id,
          count:count,
          page:page
        });
      console.log(res.activities);
      return res.activities;
    } catch(err) {
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
      return res.bikes;
    } catch (err) {
      return err;
    }
  }

  // set goal
  static async addGoal(username, formData) {
    try {
      formData.username = username;
      let res = await this.request("goals", formData, "post");
      return res.data;
    } catch (err) {
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
  static async getUserGoals(username, count=3, page=1) {
    try {
      const res = await this.request(
        `users/${username}/goals`, { count:count, page:page }
      );
      return res.goals;
    } catch (err) {
      return err;
    }
  }

  // get goals count
  static async getUserGoalCount(username) {
    try {
      const res = await this.request(
        `users/${username}/goals-count`
      );
      return parseInt(res.count);
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
  static async removeGoal(goalId) {
    try {
      const res = await this.request(`goals/${goalId}`, {}, "delete");
      return res;
    } catch (err) {
      return err;
    }
  }
}

export default MyStravaApi;