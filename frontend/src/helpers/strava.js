import MyStravaApi from "../services/api.js";

async function connectUserStrava(username){
  MyStravaApi.connectToStravaFrontEndApi(username);
};

async function getStravaTokens(username) {
  // const username = localStorage.getItem("currentUser");
  MyStravaApi.retrieveStravaTokens(username);
};

async function refreshAccessToken(username) {
  // const username = localStorage.getItem("currentUser");
  MyStravaApi.refreshAccessToken(username);
};

async function getUserActivities(username) {
  // const username = localStorage.getItem("currentUser");
  MyStravaApi.stravaGetUserActivities(username);
  MyStravaApi.stravaGetUserActivities(username);
};

async function stravaUserBikes(username) {
  // const username = localStorage.getItem("currentUser");
  const resp = MyStravaApi.stravaGetUserBikes(username);
  return resp;
};

export default {
  connectUserStrava,
  getStravaTokens,
  refreshAccessToken,
  getUserActivities,
  stravaUserBikes,
};