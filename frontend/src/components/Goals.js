import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "reactstrap";

import Goal from "./Goal";
import UserContext from "../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";

import MyStravaApi from "../services/api.js";

function Goals({ homePage=false }){
  const history = useHistory();
  const { currentUser } = useContext(UserContext);
  
  const [ goals, setGoals ] = useState({goals:[]});
  const [ loading, setLoading ] = useState(true);
  const [ goalsPerPage, setGoalsPerPage ] = useState(3);
  const [ page, setPage ] = useState(1);
  const [ goalCount, setGoalCount ] = useState(0);

  useEffect(() => {
    async function getUserGoals() {
      let userGoals = await MyStravaApi.getUserGoals(currentUser, goalsPerPage, page);
      let goalCountRes = await MyStravaApi.getUserGoalCount(currentUser);
      setGoals(userGoals);
      setGoalCount(goalCountRes);
      setLoading(false);
    }
    if (currentUser != null) {
      getUserGoals();
    }
  }, [currentUser]);

  async function prevPage(){
    let userGoals = await MyStravaApi.getUserGoals(currentUser, goalsPerPage, page - 1);
    setPage(page - 1);
    setGoals(userGoals);
  }

  async function nextPage(){
    let userGoalsResp = await MyStravaApi.getUserGoals(currentUser, goalsPerPage, page + 1);
    setPage(page + 1);
    setGoals(userGoalsResp);
  }

  return (
    <>
      <h3>Goals</h3>
      {homePage ? <></> : (
        <Link className="btn btn-primary" to="/goals/new">
          Set a New Goal
        </Link>
      )}
      <div className="form-inline d-flex justify-content-center">
        
        {loading ? (
          <p>...loading goals...</p>
        ) : (
          <>
            {goals.length > 0 ? (
              <div className="form-inline d-flex justify-content-center">
                <div className="col-sm-12">
                  {goals.map((g) => {
                    return <Goal userGoal={g} key={uuidv4()} />;
                  })}

                  {homePage ? (
                    <Button color="primary" onClick={() => history.push("./goals")}>
                      More Goals &#8594;
                    </Button>
                  ) : (
                    <div>
                      { page <= 1 ? (
                        <div></div>
                      ) : (
                        <Button onClick={() => prevPage()}>
                          &#8592; Previous Page
                        </Button>
                      )}
                      { page * goalsPerPage >= goalCount? (
                        <></>
                      ) : (
                        <Button onClick={() => nextPage()}>
                          Next Page &#8594;
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>  
            ) : (
              <p>No Goals Loaded</p>
            )}       
          </>
        )}
      </div>
    </>
  );
}

export default Goals;