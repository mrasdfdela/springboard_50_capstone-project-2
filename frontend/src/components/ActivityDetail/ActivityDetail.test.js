import { render, /* fireEvent, **/ screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import ActivityDetail from "./ActivityDetail";

function renderActivityDetails() {
  return render(
    <MemoryRouter>
      <ActivityDetail path="activities/:activityId" />
    </MemoryRouter>
  );
}

it('renders without crashing', () =>{
  renderActivityDetails();
});

it('renders with loading message', () =>{
  renderActivityDetails();
  expect(screen.getByText(`...loading activity...`)).toBeInTheDocument();
})