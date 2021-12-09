import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import UserContext from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";

import MyStravaApi from "../services/api.js";

function GoalDetail() {
  const { goalId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [goal, setGoal] = useState({ goals: [] });
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    async function getUserGoals() {
      let respGoal = await MyStravaApi.getGoal(goalId);
      setGoal(respGoal);
      setDoneLoading(true);
      console.log(respGoal);
      return goal;
    }
    getUserGoals();
  }, [currentUser]);

  // const startDt = goal.startdt.substr(0, 10);
  // let endDt = goal.enddt !== null ? goal.enddt.substr(0, 10) : false;
  console.log(goal)

  return (
    <>
      {!doneLoading || typeof goal.enddt === "undefined" ? (
        <h6>...loading goal...</h6>
      ) : (
        <Card key="goalid">
          <CardTitle>Goal for: {goal.enddt.substr(0, 10)}</CardTitle>
          <CardSubtitle>
            Start: {goal.startdt.substr(0, 10)} - End:{" "}
            {goal.enddt.substr(0, 10)}
          </CardSubtitle>
          <CardBody>
            {goal.distance > 0 ? <p>{goal.miles} miles</p> : <div></div>}
            {goal.kilojoules > 0 ? (
              <p>{goal.calories} calories</p>
            ) : (
              <div></div>
            )}
            {goal.time > 0 ? <p>{goal.timeStr}</p> : <div></div>}
            <p>Goal Id: {goal.goalid}</p>
          </CardBody>
        </Card>
      )}
      <Link className="btn btn-primary" to="./">
        &#8592; Back to Goals
      </Link>
    </>
  );
}

export default GoalDetail;
