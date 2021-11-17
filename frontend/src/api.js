import axios from "axios";
const BASE_URL = "http://localhost:3001";

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
  // static async connectToStrava(){
  //   await this.request('auth/strava');
  // }

  static async connectToStravaFrontEndApi(username){
  //   const respType = 'code';
  //   const redirectUri = 'http://localhost:3001/auth/strava/callback';
  //   const scope = 'activity:read_all,activity:write';
  //   const clientId = '73357';
  //   const state = username;
  //   try {
  //     const res = await axios.get(
  //       "https://www.strava.com/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fstrava%2Fcallback&scope=activity%3Aread_all,activity%3Awrite&client_id=73357",
  //       {
  //         params: {
  //           response_type: respType,
  //           redirect_uri: redirectUri,
  //           scope: scope,
  //           client_id: clientId,
  //           state: state,
  //         },
  //       }
  //     );
  //     return res.data;
  //   } catch (err){
  //     return(err);
  //   }
    const respType = "code";
    const redirectUri =
      "http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fstrava%2Fcallback";
    const scope = "activity%3Aread_all,activity%3Awrite";
    const clientId = "73357";

    window.location = `https://www.strava.com/oauth/authorize?response_type=${respType}&redirect_uri=${redirectUri}&scope=${scope}&state=${username}&client_id=${clientId}`;
  }

  static async retrieveStravaTokens(username){
    try {
      const userRes = await this.request(`users/${username}/details`);
      const clientId = "73357";
      const clientSecret = "8c1b9a9e093abe7dc39c6d34e4230f9244783c86";
      const code = userRes.user.strava_auth_code;
      
      // retrieve strava user info, including refresh token, access token, and athlete id
      // window.location = `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`
      const codeRes = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`
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
  
}

export default MyStravaApi;