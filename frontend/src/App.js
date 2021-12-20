import React, { useEffect, useState } from "react";

import Router from "./Router";
import UserContext from "./contexts/UserContext";
import StravaApiContext from "./contexts/StravaApiContext";

import MyStravaApi from "./services/api.js";
import user from "./helpers/user";
import strava from "./helpers/strava";
import './App.css';

function App() {
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ currentToken, setCurrentToken ] = useState(null);
  const {
    stravaOauth,
    stravaGetTokens,
    stravaRefreshToken,
    stravaGetActivities,
    stravaGetBikes,
  } = strava;

  useEffect(() => {
    let token = localStorage.getItem("currentToken");
    let username = localStorage.getItem("currentUser");

    if (token && username) {
      MyStravaApi.getUser(username).then( (res)=> {
        if (res instanceof Error) {
          user.userLogout();
        } else {
          MyStravaApi.token = token
          setCurrentToken(token);
          setCurrentUser(username);
        }
      });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
        currentToken: currentToken,
        setCurrentToken: setCurrentToken,
      }}
    >
      <StravaApiContext.Provider
        value={{
          stravaOauth: stravaOauth,
          stravaGetTokens: stravaGetTokens,
          stravaRefreshToken: stravaRefreshToken,
          stravaGetActivities: stravaGetActivities,
          stravaGetBikes: stravaGetBikes,
        }}
      >
        <div className="App">
          <Router />
        </div>
      </StravaApiContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
