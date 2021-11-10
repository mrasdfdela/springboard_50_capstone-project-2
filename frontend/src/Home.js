import React, { useContext } from "react";
// import { useHistory } from "react-router-dom";
import { Button, Form } from "reactstrap";

import UserContext from "./UserContext";

function Home({connectStrava}){
  const { currentUser } = useContext(UserContext);
  // const history = useHistory();

  const handleSubmit = (e)=> {
    e.preventDefault();
    connectStrava();
  }

  return (
    <>
      <h3>Home</h3>
      { currentUser === null ? (
        <p>Nobody is signed in</p>
      ) : (
        <>
          <p>Welcome, {currentUser.username}!</p>
          { currentUser.athlete_id ? (
            <p>You have connected your strava</p>
          ) : (
            <>
              <Form className="form" onSubmit={handleSubmit}>
                <p>You have not connected your strava</p>
                <Button color="primary" className="mt-1">Connect Strava</Button>
              </Form>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Home;