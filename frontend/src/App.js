import React, { useEffect, useState } from "react";

import UserContext from "./contexts/UserContext";
import Router from "./Router";

import MyStravaApi from "./services/api.js";
import user from "./helpers/user";
import './App.css';

function App() {
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ currentToken, setCurrentToken ] = useState(null);

  useEffect(() => {
    let token = localStorage.getItem("currentToken");
    let username = localStorage.getItem("currentUser");

    if (token && username) {
      MyStravaApi.getUser(username).then( (res)=> {
        if (res instanceof Error) {
          user.userLogout();
          // localStorage.removeItem("currentUser");
          // localStorage.removeItem("currentToken");
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
        setCurrentToken: setCurrentToken
      }}
    >
      <div className="App">
        <Router />
      </div>
    </UserContext.Provider>
  );
}

export default App;
