import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

import GoalUpdate from './GoalUpdate';

function renderGoalUpdate() {
  return render(
    <MemoryRouter>
      <GoalUpdate path="goals/:goalId/edit" />
    </MemoryRouter>
);
}

it('renders without crashing', () =>{
  renderGoalUpdate();
});

it('renders with correct user greeting', ()=> {
  renderGoalUpdate();
  expect(screen.getByText(`Update Goal`)).toBeInTheDocument();
  expect(screen.getByText(`Set Goal!`)).toBeInTheDocument();
})