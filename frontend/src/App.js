import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import UserContext from "./UserContext";
import NavBar from "./NavBar";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import UserUpdate from "./UserUpdate"
import StravaTokens from "./StravaTokens";
import Activities from "./Activities";
import Activity from "./Activity";
import Goals from "./Goals";
import Profile from "./Profile";

import MyStravaApi from "./api.js";
import './App.css';

function App() {
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ currentToken, setCurrentToken ] = useState(null);

  useEffect( () => {
    const token = localStorage.getItem("currentToken");
    const username = localStorage.getItem("currentUser");
    
    if (token) {
      const getUser = async(username)=> (await MyStravaApi.getUser(username));
      MyStravaApi.token = token;
      getUser(username).then((resp) => {
        setCurrentToken(token);
        setCurrentUser(resp);
      });
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
      let loggedInUser;
      if (newToken) {
        loggedInUser = await MyStravaApi.getUser(username);
        console.log(loggedInUser);
        setCurrentUser(loggedInUser);
        setCurrentToken(newToken);

        localStorage.setItem("currentUser", username);
        localStorage.setItem("currentToken", newToken);
      }
      // if(!loggedInUser.athlete_id){
      //   const stravaData = MyStravaApi.connectToStravaFrontEnd;
      //   console.log(stravaData);
      // };
    } catch {
      console.log("Error; user not logged in...")
    }
  }

  async function userLogout(){
    setCurrentUser(null);
    setCurrentToken(null);
    MyStravaApi.token = null;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentToken");
  }

  async function patchUserDetails(formData){
    try {
      await MyStravaApi.patchUser(formData);
      MyStravaApi.getUser(formData.username).then(res=>{
        setCurrentUser(res);
      });
    } catch (error) {

    }
  }

  // async function connectStrava(){
  //   MyStravaApi.connectToStrava();
  // }
  const connectUserStrava = (username)=>{
    MyStravaApi.connectToStravaFrontEndApi(username);
  }

  // bug: unable to pass in user context into 
  const getStravaTokens = async ()=> {
    const user = await MyStravaApi.getUser(currentUser);
    MyStravaApi.retrieveStravaTokens(user);
  };

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
              <Home connectUserStrava={connectUserStrava}/>
            </Route>
            <Route exact path="/login">
              <Login userLogin={userLogin} />
            </Route>
            <Route exact path="/signup">
              <Signup userSignUp={userSignUp} />
            </Route>
            <Route exact path="/strava-tokens">
              <StravaTokens getStravaTokens={getStravaTokens}
              />
            </Route>
            <Route exact path="/profile">
              <Profile
                userDetails={"userDetails"}
                patchUserDetails={'patchUserDetails'}/>
            </Route>
            <Route exact path="/user-update">
              <UserUpdate 
                patchUserDetails={patchUserDetails}
              />
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
