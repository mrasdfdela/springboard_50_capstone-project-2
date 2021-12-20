import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import NavBar from "./components/navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";

import Profile from "./components/Profile";
import UserUpdate from "./components/UserUpdate";

// import StravaStartup from "./components/StravaStartup";
// import StravaTokens from "./components/StravaTokens";
import Activities from "./components/Activities";
import Activity from "./components/Activity";
import Goals from "./components/Goals";
import GoalDetail from "./components/GoalDetail";
import GoalSet from "./components/GoalSet";
import GoalUpdate from "./components/GoalUpdate";

function Router() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          {/* <Route exact path="/strava-startup" component={StravaStartup} /> */}
          {/* <Route exact path="/strava-tokens" component={StravaTokens} /> */}
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/user-update" component={UserUpdate} />
          <Route exact path="/activities" component={Activities} />
          <Route exact path="/activities/:id" element={Activity} />
          <Route exact path="/goals/new" component={GoalSet} />
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
