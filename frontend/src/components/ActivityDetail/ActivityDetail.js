import React, { 
  // useContext, 
  useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

// import UserContext from "../contexts/UserContext";
import MyStravaApi from "../../services/api.js";

function ActivityDetail() {
  const { activityId } = useParams();
  // const { currentUser } = useContext(UserContext);
  const [ activity, setActivity ] = useState({});
  const [ loading, setLoading] = useState(true);

  useEffect(() => {
    async function getActivity() {
      let actResp = await MyStravaApi.getActivity(activityId);
      setActivity(actResp);
      setLoading(false);
    }
    getActivity();
  }, [activityId]);

  const actName = activity.description;
  const date = activity.start_date ? activity.start_date.substring(0,10) : "";
  const time = activity.time;
  const miles = activity.miles;
  const calories = activity.calories;
  const url = `./`;

  return (
    <>
      {loading ? (
        <h6>...loading activity...</h6>
      ) : (
        <>
          <Card className="border-0">
            <CardTitle>{actName}</CardTitle>
            <CardSubtitle>{date}</CardSubtitle>
            <CardBody>
              <p>Miles: {miles}</p>
              <p>Moving Time: {time}</p>
              <p>Calories: {calories}</p>
            </CardBody>
          </Card>
            <Link className="btn btn-primary" to={url}>
              &#8592; Back to Activities
            </Link>
        </>
      )}
    </>
  );
}

export default ActivityDetail;
