import React, { 
  useContext, 
  // useEffect, 
  useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Form, Input, Label } from "reactstrap";

import UserContext from "./UserContext";
import "./UserUpdate.css";

function UserUpdate() {
  const { currentUser } = useContext(UserContext);
  const [ formData, setFormData ] = useState(currentUser);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {currentUser ? (
        <>
          <div className="d-flex justify-content-center">
            <Card className="col-sm-6">
              <CardBody>
                <CardTitle>Update User {currentUser.username}</CardTitle>
                <Form className="form" onSubmit={handleSubmit}>
                  <Label for="firstName"></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={currentUser.username}
                    onChange={handleChange}
                  />
                  <Label for="lastName"></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={currentUser.lastName}
                    onChange={handleChange}
                  />
                  <Label for="email"></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    value={currentUser.email}
                    onChange={handleChange}
                  />
                  <Button color="primary" className="mt-1">
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </div>

          <div className="d-flex justify-content-center mt-4">
            <Card className="col-sm-6">
              <CardBody>
                <CardTitle>Update Password</CardTitle>
                <Form className="form" onSubmit={() => console.log("hello")}>
                  <Label for="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    placeholder="Enter Current Password"
                    onChange={handleChange}
                  />
                  <Label for="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    onChange={handleChange}
                  />
                  <Label for="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    placeholder="Confirm New Password"
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
      ) : (
        <h3>...loading...</h3>
      )}
    </>
  );
}

export default UserUpdate;
