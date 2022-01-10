import { render, /* fireEvent, **/ screen } from "@testing-library/react";
import UserContext from "../../contexts/UserContext";
import Activities from "./Activities";

const testUser = "testUser";
function renderActivities() {
  return render(
    <UserContext.Provider
      value={{
        currentUser: testUser,
        currentToken: "testToken",
      }}
    >
      <Activities />
    </UserContext.Provider>
  );
}

it("renders without crashing", () => {
  renderActivities();
});

it("renders with correct user greeting", () => {
  renderActivities();
  expect(screen.getByText(`Activities`)).toBeInTheDocument();
});
