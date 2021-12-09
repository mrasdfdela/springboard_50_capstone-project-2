import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import NavBar from "./components/navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

import Profile from "./components/Profile";
import UserUpdate from "./components/UserUpdate";

import StravaTokens from "./contexts/StravaTokens";
import Activities from "./components/Activities";
import Activity from "./components/Activity";
import Goals from "./components/Goals";
import GoalDetail from "./components/GoalDetail";
import GoalSet from "./components/GoalSet";
import GoalUpdate from "./components/GoalUpdate";

import MyStravaApi from "./services/api.js";

function Router() {
  const connectUserStrava = (username) => {
    MyStravaApi.connectToStravaFrontEndApi(username);
  };
  const getStravaTokens = async () => {
    const username = localStorage.getItem("currentUser");
    MyStravaApi.retrieveStravaTokens(username);
  };
  const testRefreshAccessToken = async () => {
    const username = localStorage.getItem("currentUser");
    MyStravaApi.refreshAccessToken(username);
  };

  const testingGetUserActivities = async () => {
    const username = localStorage.getItem("currentUser");
    MyStravaApi.stravaGetUserActivities(username);
  };
  const stravaUserBikes = async () => {
    const username = localStorage.getItem("currentUser");
    MyStravaApi.stravaGetUserBikes(username);
  };
  const createUserGoal = async (formData) => {
    const username = localStorage.getItem("currentUser");
    MyStravaApi.addGoal(username, formData);
  };

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <Switch>
          <Route exact path="/">
            <Home
              connectUserStrava={connectUserStrava}
              testRefreshAccessToken={testRefreshAccessToken}
              testingGetUserActivities={testingGetUserActivities}
              stravaUserBikes={stravaUserBikes}
            />
          </Route>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/strava-tokens">
            <StravaTokens getStravaTokens={getStravaTokens} />
          </Route>
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user-update" component={UserUpdate} />
          <Route exact path="/activities" component={Activities} />
          <Route exact path="/activities/:id" element={Activity} />
          <Route exact path="/goals/new">
            <GoalSet createUserGoal={createUserGoal} />
          </Route>
          <Route exact path="/goals/:goalId" component={GoalDetail} />
          <Route exact path="/goals/:goalId/edit" component={GoalUpdate} />
          <Route exact path="/goals" component={Goals} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Router;
