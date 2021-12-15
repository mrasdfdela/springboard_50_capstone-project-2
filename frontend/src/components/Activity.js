import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

function Activity({activity}){
  const actName = activity.description;
  const date = activity.date.toString().substring(0,10);
  const time = activity.time;
  const miles = activity.miles;
  const calories = activity.calories;
  const url = `./activities/${activity.activityid}`;

  return (
    <>
      <Card>
        <a href={url}>
          {actName} - {date}
        </a>
        <CardBody>
          <p>Miles: {miles}</p>
          <p>Moving Time: {time}</p>
          <p>Calories: {calories}</p>
        </CardBody>
      </Card>
    </>
  );
}

export default Activity;