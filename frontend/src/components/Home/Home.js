import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";

import Activities from "../Activities/Activities";
import Goals from "../Goals/Goals";
import UserContext from "../../contexts/UserContext";
import StravaApiContext from "../../contexts/StravaApiContext";
import "./Home.css";

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
          <h3>{currentUser}'s Latest User Activity</h3>
          <div className="d-flex justify-content-center">
            <Card className="col-sm-6 border-0">
              <Activities homePage={true}/>
            </Card>
            <Card className="col-sm-6 border-0">
              <Goals homePage={true}/>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export default Home;