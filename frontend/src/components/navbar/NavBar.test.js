import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import UserContext from "../../contexts/UserContext";
import NavBar from "./NavBar";

const noUser = {
  currentUser: null,
  currentToken: null,
};
const testUser = {
  currentUser: "testUser",
  currentToken: "testToken",
};

function renderNavBar(user){
  return render(
    <UserContext.Provider
      value={{
        currentUser: user.currentUser,
        currentToken: user.currentToken,
      }}
    >
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </UserContext.Provider>
  );
}

it("renders login navbar without crashing", function () {
  renderNavBar(noUser);
});
it("renders login navbar correctly", function () {
  renderNavBar(noUser);

  expect(screen.getByText(`My-Strava`)).toBeInTheDocument();
  expect(screen.getByText(`Login`)).toBeInTheDocument();
  expect(screen.getByText(`Signup`)).toBeInTheDocument();
});

it("renders logged in user without crashing", function () {
  renderNavBar(testUser);
});
it("renders logged in navbar correctly", function () {
  renderNavBar(testUser);
  
  expect(screen.getByText(`My-Strava`)).toBeInTheDocument();
  expect(screen.getByText(`${testUser.currentUser}'s Activities`)).toBeInTheDocument();
  expect(screen.getByText(`Goals`)).toBeInTheDocument();
  expect(screen.getByText(`${testUser.currentUser}`)).toBeInTheDocument();
  expect(screen.getByText(`Logout`)).toBeInTheDocument();
});