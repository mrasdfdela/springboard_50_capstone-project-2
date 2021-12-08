import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { Button, Card, CardBody, CardTitle, Form, Input, Label } from "reactstrap";

import Goal from "./Goal";
import UserContext from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";

import MyStravaApi from "../services/api.js";

function Goals(){
  const { currentUser } = useContext(UserContext);
  const [ goals, setGoals ] = useState({goals:[]});
  const [ doneLoading, setDoneLoading ] = useState(false);

  useEffect(() => {
    async function getUserGoals() {
      let userGoals = await MyStravaApi.getUserGoals(currentUser);
      // console.log(userGoals.goals);
      setGoals(userGoals.goals);
      console.log(userGoals.goals);
      setDoneLoading(true);
      return userGoals;
    }
    getUserGoals();
  }, [currentUser]);

  // const handleChange = (e)=> {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // }

  // const handleSubmit = (e)=> {
  //   e.preventDefault();
  //   console.log(goals);
  //   console.log('form submitted!');
  // }

  return (
    <>
      <h3>Goals</h3>
      {doneLoading === false ? (
        <p>I have no goals</p>
        ) : (
        <div className="form-inline d-flex justify-content-center">
          <div className="col-sm-6">
            <p>I have many, many goals.</p>
            {goals.map((g) => {
              return <Goal userGoal={g} key={uuidv4()} />;
            })}
          </div>
        </div>
        )
      }
      <Link className="btn btn-primary" to="/set-goal">
        New Goal
      </Link>
    </>
  );
}

export default Goals;