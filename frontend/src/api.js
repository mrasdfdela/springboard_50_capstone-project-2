import axios from "axios";
const BASE_URL = "http://localhost:3001";

class MyStravaApi {
  static token;

  // setup endpoint template
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    // pass in an authorization token via the header
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MyStravaApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
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
    return res.token;
  }
  // Get user info
  static async getUser(user){
    let res = await this.request(`users/${user}`);
    let { username, firstName, lastName, email } = res.user;
    return {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email
    };
  }
}

export default MyStravaApi;