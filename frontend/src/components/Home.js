import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "reactstrap";

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
      { loading ? (
        <>
          <h3>Welcome Back!</h3>
          <p>Please <Link to={"./login"}>Login</Link></p>
        </>
      ) : (
        <>
          <h3>Latest Activity</h3>
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