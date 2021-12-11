import React, { useContext, useState } from "react";
import { useEffect } from "react/cjs/react.development";
// import { useHistory } from "react-router-dom";
import { Button, Form } from "reactstrap";

import UserContext from "../contexts/UserContext";
import MyStravaApi from "../services/api";

function Home({
  connectUserStrava,
  testRefreshAccessToken,
  testingGetUserActivities,
  stravaUserBikes}) {
  const { currentUser } = useContext(UserContext);
  const [ userData, setUserData ] = useState({});
  // const history = useHistory();

  useEffect( ()=>{
    async function getUserInfo() {
      MyStravaApi.getUser(currentUser).then((res)=>{
        setUserData(res);
      });
    }
    if (currentUser) {
      getUserInfo();
    }
  },[currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    connectUserStrava(userData.username);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    testingGetUserActivities();
  };

  const handleDownloadBikes = (e) => {
    e.preventDefault();
    stravaUserBikes();
  };

  const handleRefresh = (e) => {
    e.preventDefault();
    testRefreshAccessToken();
  };

  return (
    <>
      <h3>Home</h3>
      {currentUser === null ? (
        <p>Nobody is signed in</p>
      ) : (
        <>
          <p>Welcome, {userData.firstName}!</p>
          {userData.athlete_id ? (
            <>
              <p>You have connected your strava</p>
              <Form className="form" onSubmit={handleRefresh}>
                <p>Refresh Access Token</p>
                <Button color="primary" className="mt-1">
                  Refresh Access Token
                </Button>
              </Form>
              <Form className="form" onSubmit={handleDownload}>
                <p>Download Strava Data Here</p>
                <Button color="primary" className="mt-1">
                  Download Strava Data
                </Button>
              </Form>
              <Form className="form" onSubmit={handleDownloadBikes}>
                <Button color="primary" className="mt-1">
                  Download Strava Bike Data
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Form className="form" onSubmit={handleSubmit}>
                <p>You have not connected your strava</p>
                <Button color="primary" className="mt-1">
                  Connect Strava
                </Button>
              </Form>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Home;