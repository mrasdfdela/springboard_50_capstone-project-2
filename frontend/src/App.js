import React, { useState } from "react";
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

import MyStravaApi from "./api.js";

function App() {
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ currentToken, setCurrentToken ] = useState(null);
  // async function userSignUp(formData){
  //   try {
  //     const newToken = await JoblyApi.registerUser(formData);
  //     setCurrentUser(formData.username);
  //     setCurrentToken(newToken);

  //     const newUser = await getUserDetails(username);
  //     setUserDetails(newUser);
  //   } catch {
  //     console.log("User not stored in session!");
  //   }
  // }
  async function userSignUp(formData){
    try {
      const newToken = await MyStravaApi.registerUser(formData);
      setCurrentUser(formData.username);
      setCurrentToken(newToken);
      console.log(`state currentUser: ${currentUser}`);
      console.log(`state currentToken: ${currentToken}`);

      // const newUser = await getUserDetails(formData.username);
      // setUserDetails(newUser);
    } catch {
      console.log("Error. User not registered...");
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar userLogout={null} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup">
            <Signup userSignUp={userSignUp} />
          </Route>
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
