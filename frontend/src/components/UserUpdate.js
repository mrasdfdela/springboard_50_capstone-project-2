import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Form, Input, Label } from "reactstrap";

import Athlete from "./Athlete";

import UserContext from "../contexts/UserContext";
import user from "../helpers/user";
import MyStravaApi from "../services/api";
import "./UserUpdate.css";

function UserUpdate() {
  const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [userLoaded, setUserLoaded] = useState(false);
  const [bikeData, setBikeData] = useState([]);
  const [bikesLoaded, setBikesLoaded] = useState(false);
  const history = useHistory();

  useEffect(()=>{
    async function getUserDetails(){
      if(currentUser != null){
        return await MyStravaApi.getUser(currentUser);
      } else {
        return false;
      }
    }
    getUserDetails().then( (res)=>{
      if (res){
        setFormData(res);
        setUserLoaded(true);
      }
    });
  }, [currentUser]);

  useEffect( ()=>{
    async function getBikes(){
      if (currentUser != null) {
        const bikes = await MyStravaApi.getUserBikes(currentUser);
        return bikes;
      } else {
        return false
      }
    }
    getBikes().then( (res)=> {
      if (res) {
        console.log(res);
        setBikeData(res);
        setBikesLoaded(true);
      }
    });
  },[currentUser])
  const handleSubmit = (e) => {
    e.preventDefault();
    formData['username'] = currentUser;
    user.patchUserDetails(formData);
    history.push("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {bikesLoaded && userLoaded ? (
        <div>
          <Athlete athleteId={formData.athlete_id} bikes={bikeData} />
        </div>
      ) : (
        <div></div>
      )}
      {userLoaded ? (
        <>
          <div className="d-flex justify-content-center">
            <Card className="col-sm-6">
              <CardBody>
                <CardTitle>
                  Update <em>{currentUser}</em>
                </CardTitle>
                <Form className="form" onSubmit={handleSubmit}>
                  <Label for="firstName"></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    defaultValue={formData.firstName}
                    onChange={handleChange}
                  />
                  <Label for="lastName"></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    defaultValue={formData.lastName}
                    onChange={handleChange}
                  />
                  <Label for="email"></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="E-Mail"
                    defaultValue={formData.email}
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
