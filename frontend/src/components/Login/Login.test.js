import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

import UserContext from "../../contexts/UserContext";
import StravaApiContext from "../../contexts/StravaApiContext";

import Login from './Login';

const noUser = {
  currentUser: null,
  currentToken: null,
};
function renderLogin(user) {
  return render(
    <MemoryRouter>
      <StravaApiContext.Provider
        value={{
          stravaRefreshToken: () => {},
          stravaGetActivities: () => {},
          stravaGetBikes: () => {},
        }}
      >
        <UserContext.Provider
          value={{
            currentUser: user.currentUser,
            currentToken: user.currentToken,
          }}
        >
          <Login />
        </UserContext.Provider>
      </StravaApiContext.Provider>
    </MemoryRouter>
  );
}

it('renders without crashing', () =>{
  renderLogin(noUser);
});

it('renders login screen', ()=> {
  renderLogin(noUser);
  expect(screen.getAllByText(`Login`)).toBeTruthy();
  expect(screen.getByText(`Username`)).toBeInTheDocument();
  expect(screen.getByText(`Password`)).toBeInTheDocument();
})