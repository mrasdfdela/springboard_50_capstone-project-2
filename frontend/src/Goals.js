import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { Button, Card, CardBody, CardTitle, Form, Input, Label } from "reactstrap";
import UserContext from "./UserContext";

import MyStravaApi from "./api.js";

function Goals(){
  const { currentUser } = useContext(UserContext);
  const [ goals, setGoals ] = useState([]);
  const [ formData, setFormData ] = useState([]);

  useEffect( ()=>{
    async function getUserGoals() {
      let userGoals = await MyStravaApi.getUserGoals(currentUser.username);
      return userGoals;
    }
    setGoals(getUserGoals());
    console.log(goals);
  },[currentUser]);

  const handleChange = (e)=> {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    console.log(goals);
    console.log('form submitted!');
  }

  return (
    <>
      <h3>Goals</h3>
      {goals.length > 0 ? (
        <p>I have no goals</p>
      ) : (
        <p>I have many, many goals.</p>
        // goals.map((g) => {
        //   return <h1>Goal Placeholder</h1>;
        // })
      )}
      <Link className="btn btn-primary" to="/set-goal">New Goal</Link>
    </>
  );
}

export default Goals;