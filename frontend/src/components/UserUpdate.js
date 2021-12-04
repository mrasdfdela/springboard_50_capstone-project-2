import React, { useContext, useState /**, useEffect*/ } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Form, Input, Label } from "reactstrap";

import UserContext from "../contexts/UserContext";
import user from "../helpers/user";
import "./UserUpdate.css";

function UserUpdate() {
  const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState(currentUser);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    formData['username'] = currentUser.username;
    user.patchUserDetails(formData);
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
                    defaultValue={currentUser.firstName}
                    onChange={handleChange}
                  />
                  <Label for="lastName"></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    defaultValue={currentUser.lastName}
                    onChange={handleChange}
                  />
                  <Label for="email"></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                  />
                  <Label for="password"></Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <Label for="password" className="mt-4">
                    Confirm Password To Update:
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Current Password"
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  <Button color="primary" className="mt-3">
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
