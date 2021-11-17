import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import UserContext from "./UserContext";

function StravaTokens({getStravaTokens}){
  const { currentUser } = useContext(UserContext);

  console.log('Current User:');
  console.log(currentUser);
  // if (!currentUser.strava_access_token) {
  //   getStravaTokens(currentUser);
  // }

  return (
    <>
      <Redirect to="/" />
    </>
  )
}

export default StravaTokens;