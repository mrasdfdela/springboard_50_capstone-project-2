import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import App from './App';

it('renders without crashing', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
});