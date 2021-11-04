import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

// import logo from './logo.svg';
import './App.css';
import NavBar from "./NavBar";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Activities from "./Activities";
import Activity from "./Activity";
import Goals from "./Goals";
import Profile from "./Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar userLogout={null} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route 
            exact path="/signup"
            component={Signup}
            userSignup={"userSignup"}
          />
          <Route exact path="/profile">
              <Profile
                userDetails={"userDetails"}
                patchUserDetails={"patchUserDetails"}/>
          </Route>
          <Route 
            exact path="/activities" 
            component={Activities} />
          <Route 
            exact path="/activities/:id" 
            element={Activity} />
          <Route 
            exact path="/set-goals" component={Goals} />
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
