import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../contexts/UserContext";

import StravaApiContext from "../contexts/StravaApiContext";
import MyStravaApi from "../services/api.js";

function StravaStartup(){
  const history = useHistory();
  const [ loading, setLoading ] = useState(true);
  const { currentUser } = useContext(UserContext);
  const { stravaGetTokens } = useContext(StravaApiContext);

  useEffect( ()=>{
    if (currentUser != null){
      stravaGetTokens(currentUser);
      setLoading(false);
    }
  },[currentUser]);
  
  useEffect( ()=>{
    if (!loading){
      history.push("./strava-startup");
    }
  }, [currentUser, loading]);

  return <h4>Refreshing Strava Access Token</h4>
}

export default StravaStartup;