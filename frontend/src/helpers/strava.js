import MyStravaApi from "../services/api.js";

async function stravaOauth(username){
  await MyStravaApi.stravaOathCode(username);
};

async function stravaGetTokens(username) {
  const resp = await MyStravaApi.stravaTokensExchange(username);
  return resp;
};

async function stravaRefreshToken(username) {
  const resp = await MyStravaApi.stravaRefreshAccessToken(username);
  console.log(resp.msg);
};

async function stravaGetActivities(username) {
  await MyStravaApi.stravaGetUserActivities(username);
};

async function stravaGetBikes(username) {
  const resp = await MyStravaApi.stravaGetUserBikes(username);
  return resp;
};

export default {
  stravaOauth,
  stravaGetTokens,
  stravaRefreshToken,
  stravaGetActivities,
  stravaGetBikes
};