import React  from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";

function Goal({userGoal}){
  const startDt = userGoal.startdt.substr(0, 10);
  let endDt = userGoal.enddt !== null ? userGoal.enddt.substr(0, 10) : false;
  let userGoalLink = `/goals/${userGoal.goalid}`
  return (
    <>
      <Card>
        <CardTitle>
          Start: {startDt}
          {endDt ? <div>End: {endDt}</div> : <div></div>}
        </CardTitle>
        <CardBody>
          {userGoal.distance > 0 ? <p>{userGoal.miles} miles</p> : <div></div>}
          {userGoal.kilojoules > 0 ? <p>{userGoal.calories} caloriess</p> : <div></div>}
          {userGoal.time > 0 ? <p>{userGoal.time}</p> : <div></div>}
        </CardBody>
        <Link to={userGoalLink}>Details</Link>
      </Card>
    </>
  );
}

export default Goal;