// const { MyStravaApi } = require("../services/api.js");
import MyStravaApi from "../services/api.js";

async function userSignUp(formData) {
  try {
    const newToken = await MyStravaApi.registerUser(formData);
    if (newToken) {
      // let newUser = await MyStravaApi.getUser(formData.username);
      localStorage.setItem("currentUser", formData.username);
      localStorage.setItem("currentToken", newToken);
      return newToken;
    }
  } catch {
    console.log("Error; user not registered...");
  }
}

async function userLogin(username, password) {
  try {
    const newToken = await MyStravaApi.authenticateUser(username, password);
    if (newToken) {
      localStorage.setItem("currentUser", username);
      localStorage.setItem("currentToken", newToken);
      return newToken;
    }
  } catch(err) {
    console.log("Error; user not logged in...");
    console.log(err);
  }
}

async function userLogout() {
  MyStravaApi.token = null;
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentToken");
}

async function patchUserDetails(formData) {
  try {
    await MyStravaApi.patchUser(formData);
  } catch (err) {
    console.log(err);
  }
}

export default { 
  userSignUp,
  userLogin,
  userLogout,
  patchUserDetails
};