import { render, /* fireEvent, **/ screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import Goals from "./Goals";

const testUser = "testUser";
const testToken = "testToken";
const testBikes = [];
function renderGoal() {
  return render(
    <MemoryRouter>
      <UserContext.Provider
        value={{
          currentUser: testUser,
        }}
      >
        <Goals bikes={[]} />
      </UserContext.Provider>
    </MemoryRouter>
  );
}

it("renders without crashing", () => {
  renderGoal();
});

it("renders with correct user greeting", () => {
  renderGoal();
  expect(screen.getByText(`Set a New Goal`)).toBeInTheDocument();
  expect(screen.getByText(`...loading goals...`)).toBeInTheDocument();
});
