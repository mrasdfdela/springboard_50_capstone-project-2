import React, { useEffect, useState } from "react";
import { Button, Form, Input, Label } from "reactstrap";
import UserContext from "./UserContext";

function Goals(){
  const { currentUser } = useContext(UserContext);
  const [ goals, setGoals ] = useState([]);

  useEffect( ()=>{
    async function getUserGoals() {
      let userGoals = await JoblyApi.getUserGoals(currentUser.username);
    }
    setGoals(userGoals);
  });

  return (
    <>
      <h3>Goals</h3>
      { goals.length > 0 ? (
        <p>I have many, many goals.</p>
      ) : (
        goals.map( (g)=> {
          return (
            <h1>Goal Placeholder</h1>
          )
        })
      )}
    </>
  );
}

export default Goals;