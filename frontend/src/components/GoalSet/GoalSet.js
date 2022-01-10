import React, { 
  useState 
  } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import MyStravaApi from "../../services/api.js";
import "./GoalSet.css";

function GoalSet() {
  const history = useHistory();
  // const { currentUser } = useContext(UserContext);
  const [formData, setFormData] = useState([]);

  const handleChange = (e)=> {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log( formData );
  };

  const handleDate = (e)=> {
    let date = new Date(e.target.value);
    let currDt = date.toISOString().substr(0, 10);
    setFormData({ ...formData, [e.target.name]: currDt })
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    createUserGoal(formData);
    history.push("/");
  };

  const createUserGoal = async (formData) => {
    const username = localStorage.getItem("currentUser");
    MyStravaApi.addGoal(username, formData);
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardHeader>Create New Goal</CardHeader>
          <CardBody>
            <Form className="form" onSubmit={handleSubmit}>
              <FormGroup>
                <legend>Goal</legend>
                <Label for="miles"></Label>
                <Input
                  id="miles"
                  name="miles"
                  type="text"
                  placeholder="Distance (miles)"
                  autoComplete="on"
                  onChange={handleChange}
                />
                <Input
                  id="calories"
                  name="calories"
                  type="text"
                  placeholder="Calories"
                  autoComplete="on"
                  onChange={handleChange}
                />
                <Input
                  id="time"
                  name="time"
                  type="text"
                  placeholder="Time (format: hh:mm)"
                  autoComplete="on"
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <legend>Goal Timeline</legend>
                <FormGroup>
                  <Label for="timePeriod">Select Time Period:&nbsp;</Label>
                  <Input
                    id="week"
                    value="week"
                    name="timePeriod"
                    type="radio"
                    onChange={handleChange}
                  />
                  <Label for="week">&nbsp; Week&nbsp;</Label>
                  <Input
                    id="month"
                    value="month"
                    name="timePeriod"
                    type="radio"
                    onChange={handleChange}
                  />
                  <Label for="month">&nbsp; Month&nbsp;</Label>
                  <Input
                    id="year"
                    value="month"
                    name="timePeriod"
                    type="radio"
                    placeholder="Time Period"
                    autoComplete="on"
                    onChange={handleChange}
                  />
                  <Label for="year">&nbsp; Year</Label>
                </FormGroup>
                <Label for="date">Goal Start Date:</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  id="date"
                  onChange={handleDate}
                />
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