import React, { 
  useContext, 
  // useEffect, 
  useState 
  } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import UserContext from "./UserContext";
// import MyStravaApi from "./api.js";

function GoalSet({ createUserGoal }) {
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState([]);

  const handleChange = (e)=> {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e)=> {
    e.preventDefault();

    for (let prop in formData) {
      formData[prop] = parseInt( formData[prop] );
    }
    console.log('adding new goal');
    console.log(formData);
    createUserGoal(formData);
    history.push("/");
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardTitle>Create New Goal</CardTitle>
          <CardBody>
            <Form className="form" onSubmit={handleSubmit}>
              <Label for="distance"></Label>
              <Input
                id="distance"
                name="distance"
                type="text"
                placeholder="Distance"
                autoComplete="on"
                onChange={handleChange}
              />
              <Input
                id="kilojoules"
                name="kilojoules"
                type="text"
                placeholder="Kilojoules"
                autoComplete="on"
                onChange={handleChange}
              />
              <Input
                id="movingTime"
                name="movingTime"
                type="text"
                placeholder="Moving Time"
                autoComplete="on"
                onChange={handleChange}
              />
              <FormGroup>
                <Input
                  id="week"
                  name="week"
                  type="radio"
                  onChange={handleChange}
                />
                <Label for="week">&nbsp; Week&nbsp;</Label>
                <Input
                  id="month"
                  name="month"
                  type="radio"
                  onChange={handleChange}
                />
                <Label for="month">&nbsp; Month&nbsp;</Label>
                <Input
                  id="year"
                  name="year"
                  type="radio"
                  placeholder="Time Period"
                  autoComplete="on"
                  onChange={handleChange}
                />
                <Label for="year">&nbsp; Year</Label>
              </FormGroup>
              <Button color="primary" className="mt-1">
                Set Goal!
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default GoalSet;