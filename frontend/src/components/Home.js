import React, { useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { Card, CardBody, CardTitle } from "reactstrap";

import StravaData from "./StravaData";
import Activities from "./Activities";
import Goals from "./Goals";
import UserContext from "../contexts/UserContext";

function Home() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser != null) {
      setLoading(false);
    }
  }, [currentUser]);
  
  return (
    <>
      <h3>Welcome Back!</h3>
      <div className="d-flex justify-content-center">
        <Card className="col-sm-6">
          <Activities homePage={true}/>
        </Card>
        <Card className="col-sm-6">
          <Goals homePage={true}/>
        </Card>
      </div>
      { loading ? <p>Nobody is signed in</p> : <StravaData />}
    </>
  );
}

export default Home;