import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

import UserContext from "../../contexts/UserContext";
import UserUpdate from './UserUpdate';

const noUser = {
  currentUser: null,
  currentToken: null,
};

function renderSignup(user) {
  return render(
    <MemoryRouter>
      <UserContext.Provider
        value={{
          currentUser: user.currentUser,
          currentToken: user.currentToken,
        }}
      >
        <UserUpdate />
      </UserContext.Provider>
    </MemoryRouter>
  );
}

it('renders without crashing', () =>{
  renderSignup(noUser);
});

it('renders user loading screen', ()=> {
  renderSignup(noUser);
  expect(screen.getAllByText(`...loading...`)).toBeTruthy();
})