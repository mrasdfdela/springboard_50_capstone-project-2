import React, { useContext, useState } from "react";
import { Button, Card, CardBody, Form } from "reactstrap";
import { useHistory } from "react-router-dom";

import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
import { useEffect } from "react/cjs/react.development";

function Athlete({ athleteId, bikes, activityCount }) {
  const history = useHistory();
  let [userBikes, setUserBikes] = useState([]);
  const { currentUser } = useContext(UserContext);
  const {
    connectUserStrava,
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
    await stravaUserBikes(currentUser);
    history.push("/");
  };

  const handleUserActivities = async (e) => {
    e.preventDefault();
    await getUserActivities(currentUser);
    history.push("/");
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
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Athlete;
