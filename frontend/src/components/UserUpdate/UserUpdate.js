import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label } from "reactstrap";

import Athlete from "../Athlete/Athlete";

import UserContext from "../../contexts/UserContext";
import user from "../../helpers/user";
import MyStravaApi from "../../services/api";
import "./UserUpdate.css";

function UserUpdate() {
  const history = useHistory();

  const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [userLoaded, setUserLoaded] = useState(false);
  const [bikeData, setBikeData] = useState([]);
  const [bikesLoaded, setBikesLoaded] = useState(false);
  const [activityCount, setActivityCount] = useState(0);
  const [countLoaded, setCountLoaded] = useState(false);

  useEffect(() => {
    async function getUserDetails() {
      if (currentUser != null) {
        return await MyStravaApi.getUser(currentUser);
      } else {
        return false;
      }
    }
    getUserDetails().then((res) => {
      if (res) {
        setFormData(res);
        setUserLoaded(true);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    async function getBikes() {
      if (currentUser != null) {
        const bikes = await MyStravaApi.getUserBikes(currentUser);
        return bikes;
      } else {
        return false;
      }
    }
    getBikes().then((res) => {
      if (res) {
        setBikeData(res);
        setBikesLoaded(true);
      }
    });
  }, [currentUser]);

  useEffect( ()=>{
    async function getUserActivityCount(){
      if (currentUser != null) {
        const countRes = await MyStravaApi.getActivityCount(currentUser);
        return countRes;
      } else {
        return false;
      }
    }
    getUserActivityCount(currentUser).then((res) => {
      setActivityCount(res);
      setCountLoaded(true);
    });
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    formData["username"] = currentUser;
    user.patchUserDetails(formData);
    history.push("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {bikesLoaded && userLoaded && countLoaded ? (
        <div>
          <Athlete
            athleteId={formData.athlete_id}
            bikes={bikeData}
            activityCount={activityCount}
          />
        </div>
      ) : (
        <div></div>
      )}
      {userLoaded ? (
        <>
          <div className="d-flex justify-content-center">
            <Card className="col-sm-10 col-md-6">
              <CardBody>
                <CardTitle>
                  Update <em>{currentUser}</em>
                </CardTitle>
                <Form onSubmit={handleSubmit}>
                  <FormGroup row className="mb-0">
                    <Label
                      for="firstName"
                      className="mb-0 justify-content-left"
                      sm={3}
                    >
                      First Name
                    </Label>
                    <Col sm={9}>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        defaultValue={formData.firstName}
                        onChange={handleChange}
                        className="col-sm-10"
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row className="mb-0">
                    <Label for="lastName" sm={3}>
                      Last Name
                    </Label>
                    <Col sm={9}>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        defaultValue={formData.lastName}
                        onChange={handleChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="email" className="mb-0" sm={3}>
                      E-mail
                    </Label>
                    <Col sm={9}>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="E-Mail"
                        defaultValue={formData.email}
                        onChange={handleChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="password" className="mb-0" sm={3}>
                      Password (new)
                    </Label>
                    <Col sm={9}>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="New Password"
                        autoComplete="off"
                        onChange={handleChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup className="mt-5 mb-0" row>
                    <Label for="password" className="mb-0" sm={3}>
                      Current Password (Required):
                    </Label>
                    <Col sm={9}>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Current Password"
                        autoComplete="off"
                        onChange={handleChange}
                      />
                    </Col>
                  </FormGroup>
                  <Button color="primary" className="mt-0">
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
