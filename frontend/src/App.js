import React, { useEffect, useState } from "react";

import UserContext from "./contexts/UserContext";
import Router from "./Router";

import MyStravaApi from "./services/api.js";
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
