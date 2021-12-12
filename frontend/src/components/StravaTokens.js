import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
import { useEffect } from "react/cjs/react.development";

function StravaTokens(){
  const [ loading, setLoading ] = useState(true);
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  const { getStravaTokens } = useContext(StravaApiContext);

  useEffect( ()=>{
    if (currentUser != null){
      setLoading(false);
    }
  },[currentUser]);
  
  useEffect( ()=>{
    if (!loading){
      getStravaTokens(currentUser).then( ()=> {
        history.push("/");
      });
    }
  }, [currentUser, loading]);

  return (
    <>
      <h4>Authorizing Strava</h4>
    </>
  )
}

export default StravaTokens;