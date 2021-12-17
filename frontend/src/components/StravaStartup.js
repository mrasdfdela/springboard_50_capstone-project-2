import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../contexts/UserContext";

import StravaApiContext from "../contexts/StravaApiContext";

function StravaStartup(){
  const history = useHistory();
  const [ loading, setLoading ] = useState(true);
  const { currentUser } = useContext(UserContext);
  const { 
    refreshAccessToken, 
    getUserActivities,
    stravaUserBikes
  } = useContext(StravaApiContext);

  useEffect( ()=>{
    if (currentUser != null){
      setLoading(false);
    }
  },[currentUser]);
  
  useEffect( ()=>{
    if (!loading){
      refreshAccessToken(currentUser);
      getUserActivities(currentUser);
      stravaUserBikes(currentUser);
      history.push("./")
    }
  }, [currentUser, loading]);

  return <h4>Refreshing Strava Access Token</h4>
}

export default StravaStartup;