import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
import { useEffect } from "react/cjs/react.development";


function StravaTokens(){
  const history = useHistory();
  const [ loading, setLoading ] = useState(true);
  const { currentUser } = useContext(UserContext);
  const { refreshAccessToken } = useContext(StravaApiContext);

  useEffect( ()=>{
    if (currentUser != null){
      setLoading(false);
    }
  },[currentUser]);
  
  useEffect( ()=>{
    if (!loading){
      refreshAccessToken(currentUser);
      history.push("./")
    }
  }, [currentUser, loading]);

  return <h4>Refreshing Strava Access Token</h4>
}

export default StravaTokens;