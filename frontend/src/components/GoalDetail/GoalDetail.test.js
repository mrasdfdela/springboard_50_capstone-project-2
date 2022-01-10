import { render, /* fireEvent, **/ screen } from '@testing-library/react';
// import UserContext from '../../contexts/UserContext';
import { MemoryRouter } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import GoalDetail from "./GoalDetail";

function renderGoalDetails() {
  return render(
    <MemoryRouter>
      <GoalDetail path="goals/:goalId" />
    </MemoryRouter>
  );
}

it('renders without crashing', () =>{
  renderGoalDetails();
});

it('renders with loading message', () =>{
  renderGoalDetails();
  expect(screen.getByText(`...loading goal...`)).toBeInTheDocument();
})