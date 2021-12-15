import React, {useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";

import UserContext from "../contexts/UserContext";
import Activity from "./Activity";

import MyStravaApi from "../services/api";

function Activities({ homePage=false }) {
  const history = useHistory();
  const { currentUser } = useContext(UserContext);

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actPerPage, setActPerPage] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getRecentActivities() {
      let activityRes = await MyStravaApi.getUserActivities(currentUser);
      setActivities(activityRes);
      setLoading(false);
    }
    if (currentUser != null) {
      getRecentActivities();
    }
  }, [currentUser]);

  async function prevPage(){
    let activityRes = await MyStravaApi.getUserActivities(currentUser, actPerPage, page - 1);
    setPage(page - 1);
    setActivities(activityRes);
  }

  async function nextPage(){
    let activityRes = await MyStravaApi.getUserActivities(currentUser, actPerPage, page + 1);
    setPage(page + 1);
    setActivities(activityRes);
  }

  return (
    <>
      <h3>Activities</h3>
      {loading === true ? (
        <h6>...loading activities...</h6>
      ) : (
        <div>
          {activities.length > 0 ? (
            <div className="form-inline d-flex justify-content-center">
              <div className="col-sm-6">
                {activities.map((a) => {
                  return <Activity activity={a} key={a.activityid} />;
                })}
                {homePage ? (
                  <Button
                    onClick={() => history.push("./activities")}
                    color="primary"
                  >
                    More Activities &#8594;
                  </Button>
                ) : (
                  <div>
                    { page <= 1 ? (
                      <div></div>
                    ) : (
                      <Button onClick={()=>prevPage()}>&#8592; Previous Page</Button>
                    )}
                    { activities.length < actPerPage ? (
                      <></>
                    ) : (
                      <Button onClick={()=>nextPage()}>Next Page &#8594;</Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>No activities loaded</p>
          )}
        </div>
      )}
    </>
  );
}

export default Activities;