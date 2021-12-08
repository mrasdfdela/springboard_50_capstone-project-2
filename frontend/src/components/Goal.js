import React  from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Form, Input, Label } from "reactstrap";

function Goals({userGoal}){
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
          <p>{userGoal.distance}</p>
          <p>{userGoal.kilojoules}</p>
          <p>{userGoal.time}</p>
        </CardBody>
        <Link to={userGoalLink}>Details</Link>
      </Card>
    </>
  );
}

export default Goals;