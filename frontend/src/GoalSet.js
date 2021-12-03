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
  DatePicker,
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

    // for (let prop in formData) {
    //   formData[prop] = parseInt( formData[prop] );
    // }
    console.log('adding new goal');
    console.log(formData);
    // createUserGoal(formData);
    history.push("/");
  };

  function getMonday(){
    const today = new Date();
    const dow = today.getDay();

    const currWkMonday = today.getDate() - dow + (dow == 0 ? -6 : 1); 
    const date = new Date(today.setDate(currWkMonday));
    return date.toISOString().substr(0, 10);
  }
  // const newDate = new Date();
  // // const currDate = newDate.getDate();
  // const convertedDate = newDate.toISOString().substr(0, 10);

  const convertedDate = getMonday()
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardTitle>Create New Goal</CardTitle>
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
                  <Label for="time-period">Select Time Period:&nbsp;</Label>
                  <Input
                    id="week"
                    value="week"
                    name="time-period"
                    type="radio"
                    onChange={handleChange}
                  />
                  <Label for="week">&nbsp; Week&nbsp;</Label>
                  <Input
                    id="month"
                    value="month"
                    name="time-period"
                    type="radio"
                    onChange={handleChange}
                  />
                  <Label for="month">&nbsp; Month&nbsp;</Label>
                  <Input
                    id="year"
                    value="month"
                    name="time-period"
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
                  value="date"
                  name="date"
                  type="date"
                  value={convertedDate}
                  id="date"
                  onChange={handleChange}
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