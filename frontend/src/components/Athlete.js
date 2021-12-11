import React from "react";
import { Button, Card, CardBody } from "reactstrap";

function Athlete({ athleteId, bikes }) {
  return (
    <>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <CardBody>
            {athleteId ? (
              <>
                <h6>Athlete ID: {athleteId}</h6>
                <h6>Bikes:</h6>
                <ul>
                  {bikes.map((b) => {
                    return (
                      <li>
                        {b.desc}, <em>bike id: {b.bikeid}</em>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <>
                <p>Strava not connected</p>
                <Button>Connect Strava</Button>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default Athlete;
