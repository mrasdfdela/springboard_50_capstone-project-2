import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label} from "reactstrap";
import user from "../helpers/user";
import UserContext from "../contexts/UserContext";

function Signup(){
  const { setCurrentUser, setCurrentToken } = useContext(UserContext);
  
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
    try {
      const newToken = user.userSignUp(formData);
      setCurrentUser(formData.username);
      setCurrentToken(newToken);
    } catch(err){
      console.log(err);
    }
    
    setFormData(INITIAL_STATE);
    e.target.reset();

    setTimeout(function(){
      history.push("/");
    }, 500);
  }

  const handleChange = (e)=>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:value });
  };
  
  return (
    <>
      <h3>Signup</h3>
      <div className="d-flex justify-content-center">
        <Card className="col-md-6 col-sm-10">
          <CardBody>
            <Form className="form" onSubmit={handleSubmit}>
              <FormGroup row className="mb-1">
                <Label for="username" sm={3}>
                  Username
                </Label>
                <Col sm={9}>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="username"
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-1">
                <Label for="password" sm={3}>
                  Password
                </Label>
                <Col sm={9}>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-1">
                <Label for="firstName" sm={3}>
                  Jerry
                </Label>
                <Col sm={9}>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-1">
                <Label for="lastName" sm={3}>
                  Hsu
                </Label>
                <Col sm={9}>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-1">
                <Label for="email" sm={3}>
                  E-mail
                </Label>
                <Col sm={9}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    onChange={handleChange}
                  />
                </Col>
              </FormGroup>
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