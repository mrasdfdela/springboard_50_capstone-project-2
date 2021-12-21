import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";

import Activities from "./Activities";
import Goals from "./Goals";
import UserContext from "../contexts/UserContext";
import StravaApiContext from "../contexts/StravaApiContext";
// import MyStravaApi from "../services/api.js";

function Home() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);
  const { 
    stravaGetTokens,
    stravaGetActivities,
    stravaGetBikes
  } = useContext(StravaApiContext);

  useEffect(() => {
    if (currentUser != null) {
      stravaGetTokens(currentUser).then( (res)=> {
        if (res.tokenDownloaded) {
          stravaGetActivities(currentUser);
          stravaGetBikes(currentUser);
        }
      });
      setLoading(false);
    }
  }, [currentUser]);
  
  return (
    <>
      { loading ? (
        <>
          <h3>Welcome Back!</h3>
          <p>Please <Link to={"./login"}>Login</Link></p>
        </>
      ) : (
        <>
          <h3>{currentUser}'s Latest Activity</h3>
          <div className="d-flex justify-content-center">
            <Card className="col-sm-6">
              <Activities homePage={true}/>
            </Card>
            <Card className="col-sm-6">
              <Goals homePage={true}/>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export default Home;