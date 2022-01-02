import React, { 
  // useContext, 
  useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

// import UserContext from "../contexts/UserContext";
import MyStravaApi from "../services/api.js";

function GoalDetail() {
  const { goalId } = useParams();
  // const { currentUser } = useContext(UserContext);
  const [goal, setGoal] = useState({ goals: [] });
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    async function getUserGoals() {
      let respGoal = await MyStravaApi.getGoal(goalId);
      setGoal(respGoal);
      setDoneLoading(true);
      return goal;
    }
    getUserGoals();
  }, [goalId]);

  const goalEditLink = `./${goalId}/edit`;
  return (
    <>
      {!doneLoading || typeof goal.startdt === "undefined" ? (
        <h6>...loading goal...</h6>
      ) : (
        <>
          <Card className="border-0" key={goalId}>
            <CardTitle>Goal for: {goal.enddt.substr(0, 10)}</CardTitle>
            <CardSubtitle>
              Start: {goal.startdt.substr(0, 10)} - End:{" "}
              {goal.enddt.substr(0, 10)}
            </CardSubtitle>
            <CardBody>
              {goal.miles > 0 ? <p>{goal.miles} miles</p> : <div></div>}
              {goal.calories > 0 ? (
                <p>{goal.calories} calories</p>
              ) : (
                <div></div>
              )}
              {typeof goal.time === 'string' ? <p>{goal.time} moving time</p> : <div></div>}
              <p>Goal Id: {goal.goalId}</p>
            </CardBody>
          </Card>
          <Link className="btn btn-secondary m-1" to="./">
            &#8592; Back to Goals
          </Link>
          <Link className="btn btn-primary m-1" to={goalEditLink}>
            Edit this goal
          </Link>
        </>
      )}
    </>
  );
}

export default GoalDetail;
