import React, { useContext, useState } from "react";
import { Button, Card, CardBody, Form } from "reactstrap";

import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
import { useEffect } from "react/cjs/react.development";
// import MyStravaApi from "../services/api";

function Athlete({ athleteId, bikes, activityCount }) {
  let [userBikes, setUserBikes] = useState([]);
  const { currentUser } = useContext(UserContext);
  const {
    connectUserStrava,
    // refreshAccessToken,
    // getUserActivities,
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
  //   await stravaUserBikes(currentUser);
    // MyStravaApi.getUserBikes(currentUser).then( (res)=>{
  //     setUserBikes(res);
  //   });
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardBody>
            {athleteId ? (
              <>
                <h6>Athlete ID:</h6>
                <p>{athleteId}</p>
              </>
            ) : (
              <>
                <Form onSubmit={handleUserConnect}>
                  <p>Strava not connected</p>
                  <Button>Connect Strava</Button>
                </Form>
              </>
            )}
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
                <Form onSubmit={handleUserBikes}>
                  <p>No bikes referenced</p>
                  <Button>Lookup Strava Bikes</Button>
                </Form>
              </>
            )}
            <h6>Rides:</h6>
            <p>{activityCount}</p>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Athlete;
