import React, { useContext } from "react";
// import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import UserContext from "./UserContext";

function Home(){
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <h3>Home</h3>
      { currentUser === null ? (
        <p>Nobody is signed in</p>
      ) : (
        <>
          <p>{currentUser.username} is signed in!</p>
        </>
      )}
    </>
  );
}

export default Home;