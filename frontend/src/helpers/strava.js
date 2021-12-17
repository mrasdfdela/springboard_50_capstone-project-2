import MyStravaApi from "../services/api.js";

async function connectUserStrava(username){
  MyStravaApi.connectToStravaFrontEndApi(username);
};

async function getStravaTokens(username) {
  MyStravaApi.retrieveStravaTokens(username);
};

async function refreshAccessToken(username) {
  MyStravaApi.refreshAccessToken(username);
};

async function getUserActivities(username) {
  MyStravaApi.stravaGetUserActivities(username);
};

async function stravaUserBikes(username) {
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