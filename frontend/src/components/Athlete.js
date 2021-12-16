import React, { useContext, useState } from "react";
import { Button, Card, CardBody, Form } from "reactstrap";
import { useHistory } from "react-router-dom";

import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
import { useEffect } from "react/cjs/react.development";
// import MyStravaApi from "../services/api";

function Athlete({ athleteId, bikes, activityCount }) {
  const history = useHistory();
  let [userBikes, setUserBikes] = useState([]);
  const { currentUser } = useContext(UserContext);
  const {
    connectUserStrava,
    refreshAccessToken,
    getUserActivities,
    stravaUserBikes,
  } = useContext(StravaApiContext);

  useEffect( ()=>{
    userBikes.length > 0 ? 
      setUserBikes(userBikes) : 
      setUserBikes(bikes);
  }, [userBikes]);

  const handleUserConnect = (e) => {
    e.preventDefault();
    connectUserStrava(currentUser);
  };

  const handleUserBikes = async (e) => {
    e.preventDefault();
    stravaUserBikes(currentUser);
    history.push("/user-update");
  };

  const handleUserActivities = async (e) => {
    e.preventDefault();
    getUserActivities(currentUser);
  };
  
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardBody>
            <Form onSubmit={handleUserConnect}>
              {athleteId ? (
                <>
                  <h6>Athlete ID:</h6>
                  <p>{athleteId}</p>
                </>
              ) : (
                <>
                  <p>Strava not connected</p>
                  <Button>Connect Strava</Button>
                </>
              )}
            </Form>
            <Form onSubmit={handleUserBikes}>
              {userBikes.length > 0 ? (
                <>
                  <h6>Bikes:</h6>
                  <ul>
                    {userBikes.map((b) => {
                      return (
                        <li key={b.bikeid}>
                          {b.desc}, <em>bike id: {b.bikeid}</em>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <p>No bikes stored!</p>
                  <Button>Download Strava Bikes</Button>
                </>
              )}
            </Form>
            <Form onSubmit={handleUserActivities}>
              {activityCount === 0 ? (
                <>
                  <p>No rides stored!</p>
                  <Button>Download user activities</Button>
                </>
              ) : (
                <>
                  <h6>Rides:</h6>
                  <p>{activityCount}</p>
                </>
              )}
            </Form>
            <Form className="mt-2">
              <Button onClick={() => refreshAccessToken(currentUser)}>
                Refresh Access Token
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Athlete;
