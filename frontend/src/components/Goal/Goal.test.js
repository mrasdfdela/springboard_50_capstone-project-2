import { render, /* fireEvent, **/ screen } from '@testing-library/react';
// import UserContext from '../../contexts/UserContext';
import { MemoryRouter } from "react-router-dom";
import UserContext from '../../contexts/UserContext';
import Goal from "./Goal";

const userGoal = {
  startdt: '2022-01-01',
  enddt: '2022-01-08',
  goalid: '1',
  distance: 1.61,
  kilojoules: 600,
  miles: 1,
  calories: 600,
  time: '1:00'
}

function renderGoal() {
  return render(
    <MemoryRouter>
      <Goal userGoal={userGoal} />
    </MemoryRouter>
  );
}

it('renders without crashing', () =>{
  renderGoal();
});

it('renders with loading message', () =>{
  renderGoal();
  expect(screen.getByText(`Start: ${userGoal.startdt}`)).toBeInTheDocument();
})