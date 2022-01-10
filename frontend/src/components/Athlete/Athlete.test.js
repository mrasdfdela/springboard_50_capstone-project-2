import { render, /* fireEvent, **/ screen } from "@testing-library/react";
import UserContext from "../../contexts/UserContext";
import StravaApiContext from "../../contexts/StravaApiContext";
import Athlete from "./Athlete";

const testUser = "testUser";
const testToken = "testToken";
const testBikes = [];
function renderAthlete() {
  return render(
    <StravaApiContext.Provider
      value={{
        stravaOauth: () => {},
        stravaGetActivities: () => {},
        stravaGetBikes: () => {},
      }}
    >
      <UserContext.Provider
        value={{
          currentUser: testUser,
          currentToken: testToken,
        }}
      >
        <Athlete 
          bikes={[]}
        />
      </UserContext.Provider>
    </StravaApiContext.Provider>
  );
}

it("renders without crashing", () => {
  renderAthlete();
});

it("renders with correct user greeting", () => {
  renderAthlete();
  expect(screen.getByText(`Strava not connected`)).toBeInTheDocument();
});
