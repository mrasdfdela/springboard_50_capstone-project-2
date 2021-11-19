import axios from "axios";
const BASE_URL = "http://localhost:3001";
// const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } = require("./config");
const STRAVA_CLIENT_ID = "73357";
const STRAVA_CLIENT_SECRET = "8c1b9a9e093abe7dc39c6d34e4230f9244783c86";


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
  static async registerUser({username,firstName,lastName,password,email}){
    console.log("api: registerUser");
    const userInfo = { 
      username: username, 
      firstName: firstName, 
      lastName: lastName,
      password: password,
      email: email
    }
    let res = await this.request(`auth/register`,userInfo,"post");
    this.token = res.token;
    return this.token;
  }
  // Login
  static async authenticateUser(username, password){
    const credentials = { username: username, password: password };
    let res = await this.request(`auth/token`, credentials, "post");
    this.token = res.token;
    return res.token;
  }
  // Get user info
  static async getUser(user){
    let res = await this.request(`users/${user}`);
    let { username, firstName, lastName, email, athlete_id } = res.user;
    return {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      athlete_id: athlete_id
    };
  }
  // Patch user info
  static async patchUser(formData){
    try {
      const token = await this.authenticateUser(formData.username, formData.password);
      console.log(formData);
      if (typeof token === "string") {
        const userInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          newPassword: formData.newPassword
        }
        let res = await this.request(
                    `users/${formData.username}`,
                    userInfo,
                    "patch");
        return res.user;
      }
    } catch(err){
      return err;
    }
  }

  // Connect user to Strava
  // Redirects to Strava login site to authorize sharing user data
  // After authorization, strava redirects to backend endpoint auth/strava/callback
  // Save strava user auth code, which will be used to request access and refresh tokens
  static async connectToStravaFrontEndApi(username){
    const respType = "code";
    const redirectUri =
      "http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fstrava%2Fcallback";
    const scope = "activity%3Aread_all,activity%3Awrite";
    window.location = `https://www.strava.com/oauth/authorize?response_type=${respType}&redirect_uri=${redirectUri}&scope=${scope}&state=${username}&client_id=${STRAVA_CLIENT_ID}`;
  }

  // Requests access and refresh tokens from strava
  // Retrieves user's auth code
  // Makes post request to retrieve access token, refresh token, and athlete id
  // Subsequently saves token to user
  static async retrieveStravaTokens(username){
    try {
      const userRes = await this.request(`users/${username}/details`);
      const code = userRes.user.strava_auth_code;
      
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
        "post");
      console.log(`Tokens updated for user: '${updatedUser.username}`);
    } catch(err) {
      return err;
    }
  }

  static async refreshAccessToken(username){
    try {
      const grantType = 'refresh_token'
      const userRes = await this.request(`users/${username}/details`);
      console.log(userRes);
      const refreshToken = userRes.user.access_token;

      const refRes = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&grant_type=${grantType}&refresh_token=${refreshToken}`
      )
      const stravaDetails = {
        username: username,
        access_token: refRes.access_token
      };

      // updates user access token
      const updatedUser = await this.request(
        "auth/strava/tokens", 
        stravaDetails, 
        "post");
      console.log(`Tokens updated for user: '${updatedUser.username}`);
    }
  }
  
}

export default MyStravaApi;