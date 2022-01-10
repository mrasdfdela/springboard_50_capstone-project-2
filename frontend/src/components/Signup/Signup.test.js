import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

import UserContext from "../../contexts/UserContext";
import Signup from './Signup';

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
        <Signup />
      </UserContext.Provider>
    </MemoryRouter>
  );
}

it('renders without crashing', () =>{
  renderSignup(noUser);
});

it('renders login screen', ()=> {
  renderSignup(noUser);
  expect(screen.getAllByText(`Signup`)).toBeTruthy();
  expect(screen.getByText(`Username`)).toBeInTheDocument();
  expect(screen.getByText(`Password`)).toBeInTheDocument();
})