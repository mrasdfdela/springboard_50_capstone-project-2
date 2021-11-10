import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

// import logo from './logo.svg';
import './App.css';

import UserContext from "./UserContext";
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
  useEffect( async () => {
    const token = localStorage.getItem("currentToken");
    const user = localStorage.getItem("currentUser");
    if (token) {
      MyStravaApi.token = token;
      const currUser = await MyStravaApi.getUser(user);
      setCurrentUser(currUser);
      setCurrentToken(token);
    }
  }, []);

  async function userSignUp(formData){
    try {
      const newToken = await MyStravaApi.registerUser(formData);
      if (newToken){
        const newUser = await MyStravaApi.getUser(formData.username);
        setCurrentUser(newUser);
        setCurrentToken(newToken);
        localStorage.setItem("currentUser", formData.username);
        localStorage.setItem("currentToken", newToken);
      }
    } catch {
      console.log("Error; user not registered...");
    }
  }

  async function userLogin(username, password){
    try {
      const newToken = await MyStravaApi.authenticateUser(username, password);
      console.log(`logged in; token: ${newToken}`)
      if (newToken) {
        const loggedInUser = await MyStravaApi.getUser(username);
        console.log(loggedInUser);
        setCurrentUser(loggedInUser);
        setCurrentToken(newToken);

        localStorage.setItem("currentUser", username);
        localStorage.setItem("currentToken", newToken);
      }
    } catch {
      console.log("Error; user not logged in...")
    }
  }

  // async function getUserInfo(username){
  //   const currUser = await MyStravaApi.getUser(user);
  // }

  async function userLogout(){
    setCurrentUser(null);
    setCurrentToken(null);
    MyStravaApi.token = null;
  }

  async function connectStrava(){
    MyStravaApi.connectToStrava();
  }

  return (
    <UserContext.Provider
      value={{
        currentUser: currentUser,
        currentToken: currentToken
      }}>
      <div className="App">
        <BrowserRouter>
          <NavBar userLogout={userLogout} />
          <Switch>
            <Route exact path="/">
              <Home connectStrava={connectStrava}/>
            </Route>
            <Route exact path="/login">
              <Login userLogin={userLogin} />
            </Route>
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
    </UserContext.Provider>
  );
}

export default App;
