import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
const user = require("../helpers/user");
// import "./Login.css";

function Login(){
  const history = useHistory();
  const INITIAL_STATE = { username: "", password: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { currentUser, setCurrentUser, setCurrentToken
    } = useContext(UserContext);
  const { 
    stravaRefreshToken, 
    stravaGetActivities, 
    stravaGetBikes 
  } = useContext(StravaApiContext);

  const handleSubmit = async (e)=> {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const token = await user.default.userLogin(username, password);
      if (typeof token === 'string') {
        setCurrentUser(username);
        setCurrentToken(token);
        stravaRefreshToken(username).then((r) => console.log(r));
        stravaGetActivities(username);
        stravaGetBikes(username);
      }
      history.push("/");
    } catch(err) {
      console.log(err);
    }
  };

  const handleChange = (e)=> {
    const {name,value} = e.target;
    setFormData({...formData, [name]:value});
  }
  
  return (
    <>
      {currentUser === null ? (
        <>
          <h3>Login</h3>
          <div className="d-flex justify-content-center">
            <Card className="col-sm-6">
              <CardBody>
                <Form className="form" onSubmit={handleSubmit}>
                  <Label for="username"></Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    autoComplete="on"
                    onChange={handleChange}
                  />
                  <Label for="password"></Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    autoComplete="on"
                    onChange={handleChange}
                  />
                  <Button color="primary" className="mt-1">
                    Login
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </div>
        </>
      ) : (
        <Redirect to="/StravaStartup" />
      )}
    </>
  );
}

export default Login;