import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label} from "reactstrap";
import "./Signup.css";

function Signup({userSignUp}){
  const INITIAL_STATE = {
    username: "",
    password: "",
    firstname:"",
    lastname:"",
    email:"",
    athlete_id:""
  }
  const history = useHistory();
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleSubmit = (e)=> {
    e.preventDefault();
    userSignUp(formData);
    setFormData(INITIAL_STATE);
    e.target.reset();

    setTimeout(function(){
      history.push("/");
    }, 5000);
  }

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:value });
  };
  
  return (
    <>
      <h3>Signup</h3>
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
              <Label for="firstName"></Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                onChange={handleChange}
              />
              <Label for="lastName"></Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                onChange={handleChange}
              />
              <Label for="email"></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="E-Mail"
                onChange={handleChange}
              />
              <Button color="primary" className="mt-1">
                Submit
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Signup;