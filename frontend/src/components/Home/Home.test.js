import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import UserContext from "../../contexts/UserContext";
import StravaApiContext from "../../contexts/StravaApiContext";
import Home from "./Home";

const noUser = {
  currentUser: null,
  currentToken: null
};
const testUser = {
  currentUser: "testUser",
  currentToken: "testToken"
};

function renderHome(user) {
  return render(
    <MemoryRouter>
      <StravaApiContext.Provider
        value={{
          stravaGetActivities: () => {},
          stravaGetBikes: () => {},
          stravaGetTokens: () => { return null }
        }}
      >
        <UserContext.Provider
          value={{
            currentUser: user.currentUser,
            currentToken: user.currentToken,
          }}
        >
          <Home />
        </UserContext.Provider>
      </StravaApiContext.Provider>
    </MemoryRouter>

  );
}

it("renders without crashing", () => {
  renderHome(noUser);
});

it("renders when no user signed in", () => {
  renderHome(noUser);
  expect(screen.getByText(`Welcome Back!`)).toBeInTheDocument();
});