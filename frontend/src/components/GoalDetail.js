import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

import UserContext from "../contexts/UserContext";
import MyStravaApi from "../services/api.js";

function GoalDetail() {
  const { goalId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [goal, setGoal] = useState({ goals: [] });
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    async function getUserGoals() {
      let respGoal = await MyStravaApi.getGoal(goalId);
      console.log('GoalDetail: respGoal')
      console.log(respGoal);
      setGoal(respGoal);
      setDoneLoading(true);
      return goal;
    }
    getUserGoals();
  }, [currentUser]);

  const goalEditLink = `./${goalId}/edit`;
  return (
    <>
      {!doneLoading || typeof goal.startdt === "undefined" ? (
        <h6>...loading goal...</h6>
      ) : (
        <>
          <Card key="goalId">
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
              <p>Goal Id: {goal.goalId}</p>
            </CardBody>
          </Card>
          <Link className="btn btn-primary" to="./">
            &#8592; Back to Goals
          </Link>
          <Link className="btn btn-primary" to={goalEditLink}>
            Edit this goal
          </Link>
        </>
      )}
    </>
  );
}

export default GoalDetail;
