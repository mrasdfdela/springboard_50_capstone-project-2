import React, { 
  // useContext, 
  useEffect, 
  useState 
  } from "react";
import { useHistory, useParams } from "react-router-dom";
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
// import UserContext from "../contexts/UserContext";
import MyStravaApi from "../services/api.js";
import "./GoalSet.css";

function GoalUpdate() {
  const { goalId } = useParams();
  const [formData, setFormData] = useState({});
  const history = useHistory();
  // const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    async function getGoalById() {
      let goalRes = await MyStravaApi.getGoal(goalId);
      // setDoneLoading(true);
      return goalRes;
    }
    getGoalById().then( (res)=>{
      setFormData(res);
    });
  }, []);
  
  const updateUserGoal = async (formData) => {
    MyStravaApi.updateGoal(formData.goalId, formData);
  };
  
  const handleChange = (e)=> {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDate = (e)=> {
    let date = new Date(e.target.value);
    let currDt = date.toISOString().substr(0, 10);
    setFormData({ ...formData, [e.target.name]: currDt })
  }

  const handleSubmit = (e)=> {
    e.preventDefault();
    updateUserGoal(formData);
    history.push("/");
  };
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardHeader>Update Goal</CardHeader>
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
                  defaultValue={formData.miles}
                  onChange={handleChange}
                />
                <Input
                  id="calories"
                  name="calories"
                  type="text"
                  placeholder="Calories"
                  defaultValue={formData.calories}
                  onChange={handleChange}
                />
                <Input
                  id="time"
                  name="time"
                  type="text"
                  placeholder="Time (format: hh:mm)"
                  defaultValue={formData.time}
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
                    checked={formData.timePeriod === "week"}
                  />
                  <Label for="week">&nbsp; Week&nbsp;</Label>
                  <Input
                    id="month"
                    value="month"
                    name="timePeriod"
                    type="radio"
                    onChange={handleChange}
                    checked={formData.timePeriod === "month"}
                  />
                  <Label for="month">&nbsp; Month&nbsp;</Label>
                  <Input
                    id="year"
                    value="year"
                    name="timePeriod"
                    type="radio"
                    placeholder="Time Period"
                    autoComplete="on"
                    onChange={handleChange}
                    checked={formData.timePeriod === "year"}
                  />
                  <Label for="year">&nbsp; Year</Label>
                </FormGroup>
                <Label for="date">Goal Start Date:</Label>
                <Input
                  id="date"
                  value="date"
                  name="date"
                  type="date"
                  value={formData.startdt}
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

export default GoalUpdate;