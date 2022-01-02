import React  from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

function Goal({userGoal}){
  const startDt = userGoal.startdt.substr(0, 10);
  let endDt = userGoal.enddt !== null ? userGoal.enddt.substr(0, 10) : false;
  let userGoalLink = `/goals/${userGoal.goalid}`
  return (
    <>
      <Card>
        <CardHeader>
          <a href={userGoalLink}>
            { endDt ? `Goal Date: ${endDt}` : <div></div> }
          </a>
        </CardHeader>
        {/* <CardTitle></CardTitle> */}
        <CardBody>
          <p>Start: {startDt}</p>
          {userGoal.distance > 0 ? <p>{userGoal.miles} miles</p> : <div></div>}
          {userGoal.kilojoules > 0 ? <p>{userGoal.calories} calories</p> : <div></div>}
          {userGoal.time !== undefined ? <p>{userGoal.time}</p> : <div></div>}
        </CardBody>
        {/* // <Link to={userGoalLink}>Details</Link> */}
      </Card>
    </>
  );
}

export default Goal;