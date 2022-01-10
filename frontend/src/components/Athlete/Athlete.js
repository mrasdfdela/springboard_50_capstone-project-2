import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardBody, Form } from "reactstrap";
import { useHistory } from "react-router-dom";

import UserContext from "../../contexts/UserContext";
import StravaApiContext from "../../contexts/StravaApiContext";
import "./Athlete.css";

function Athlete({ athleteId, bikes, activityCount }) {
  const history = useHistory();
  let [userBikes, setUserBikes] = useState([]);
  const { currentUser } = useContext(UserContext);
  const { 
    stravaOauth, 
    stravaGetActivities, 
    stravaGetBikes 
  } = useContext(StravaApiContext);

  useEffect( ()=>{
    userBikes.length > 0 ? 
      setUserBikes(userBikes) : 
      setUserBikes(bikes);
  }, [userBikes]);

  const handleUserConnect = (e) => {
    e.preventDefault();
    stravaOauth(currentUser);
  };

  const handleUserBikes = async (e) => {
    e.preventDefault();
    await stravaGetBikes(currentUser);
    history.push("/");
  };

  const handleUserActivities = async (e) => {
    e.preventDefault();
    await stravaGetActivities(currentUser);
    history.push("/");
  };
  
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardBody>
            <div className="user-info">
              {athleteId ? (
                <>
                  <h6 className="mb-0">Athlete ID:</h6>
                  <p>{athleteId}</p>
                </>
              ) : (
                <Form onSubmit={handleUserConnect}>
                  <p className="mb-1">Strava not connected</p>
                  <Button className="mb-4">Connect Strava</Button>
                </Form>
              )}
            </div>
            <div className="user-info">
              {activityCount > 0 ? (
                <>
                  <h6 className="mb-0">Rides:</h6>
                  <p>{activityCount}</p>
                </>
              ) : (
                <Form onSubmit={handleUserActivities}>
                  <p className="mb-1">No rides stored!</p>
                  <Button className="mb-4">Download user activities</Button>
                </Form>
              )}
            </div>
            <div className="user-info">
              {userBikes.length > 0 ? (
                <>
                  <h6 className="mb-0">Bikes:</h6>
                  {userBikes.map((b) => {
                    return (
                      <p key={b.bikeid} className="mb-0">
                        {b.desc}, <em>bike id: {b.bikeid}</em>
                      </p>
                    );
                  })}
                </>
              ) : (
                <Form onSubmit={handleUserBikes}>
                  <p className="mb-1">No bikes stored!</p>
                  <Button className="mb-4">Download Strava Bikes</Button>
                </Form>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Athlete;
