import { render, screen } from '@testing-library/react';
import GoalSet from './GoalSet';

function renderGoal() {
  return render(
    <GoalSet />
);
}

it('renders without crashing', () =>{
  renderGoal();
});

it('renders with correct user greeting', ()=> {
  renderGoal();
  expect(screen.getByText(`Create New Goal`)).toBeInTheDocument();
  expect(screen.getByText(`Set Goal!`)).toBeInTheDocument();
})