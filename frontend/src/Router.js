import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import NavBar from "./components/navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

import UserUpdate from "./components/UserUpdate/UserUpdate";

import Activities from "./components/Activities/Activities";
import ActivityDetail from "./components/ActivityDetail/ActivityDetail";
import Goals from "./components/Goals/Goals";
import GoalDetail from "./components/GoalDetail/GoalDetail";
import GoalSet from "./components/GoalSet/GoalSet";
import GoalUpdate from "./components/GoalUpdate/GoalUpdate";

function Router() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/user-update" component={UserUpdate} />
        <Route exact path="/activities" component={Activities} />
        <Route exact path="/activities/:activityId" component={ActivityDetail} />
        <Route exact path="/goals/new" component={GoalSet} />
        <Route exact path="/goals/:goalId" component={GoalDetail} />
        <Route exact path="/goals/:goalId/edit" component={GoalUpdate} />
        <Route exact path="/goals" component={Goals} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default Router;
