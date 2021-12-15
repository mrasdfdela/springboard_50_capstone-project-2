import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Goal from "./Goal";
import UserContext from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";

import MyStravaApi from "../services/api.js";

function Goals({ homePage=false }){
  const { currentUser } = useContext(UserContext);
  const [ goals, setGoals ] = useState({goals:[]});
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    async function getUserGoals() {
      let userGoals = await MyStravaApi.getUserGoals(currentUser);
      setGoals(userGoals.goals);
      setLoading(false);
    }
    if (currentUser != null) {
      getUserGoals();
    }
  }, [currentUser]);

  return (
    <>
      <h3>Goals</h3>
      {homePage ? (
        <div></div>  
      ) : (
        <Link className="btn btn-primary" to="/goals/new">
          Set a New Goal
        </Link>
      )}
      {loading ? (
        <p>...loading goals...</p>
      ) : (
        <div className="form-inline d-flex justify-content-center">
          <div className="col-sm-6">
            {goals.map((g) => {
              return <Goal userGoal={g} key={uuidv4()} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Goals;