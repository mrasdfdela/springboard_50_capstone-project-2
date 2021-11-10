import React, { useContext, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";

import UserContext from "./UserContext";
// import "./Login.css";

function Login({userLogin}){
  const history = useHistory();
  const {currentUser} = useContext(UserContext);
  const INITIAL_STATE = { username: "", password: "" };
  const [ formData, setFormData ] = useState(INITIAL_STATE);

  const handleSubmit = (e)=> {
    e.preventDefault();
    const {username,password} = formData;
    userLogin(username, password);
    history.push("/");
  };

  const handleChange = (e)=> {
    const {name,value} = e.target;
    setFormData({...formData, [name]:value});
  }
  
  return (
    <>
      { currentUser === null ? (
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
                    onChange={handleChange}
                  />
                  <Label for="password"></Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
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
        <Redirect to="/" />
      )}
    </>
  );
}

export default Login;