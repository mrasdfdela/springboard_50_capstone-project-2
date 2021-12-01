import React, {useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

import UserContext from "./UserContext";
import "./NavBar.css";

function NavBar({userLogout}) {
  const { currentUser } = useContext(UserContext);
  return (
    <div className="container">
      <Navbar expand="ms">
        <NavLink exact to="/" className="navbar-brand">
          My-Strava
        </NavLink>
        {currentUser ? (
          <Nav className="ml-auto navbar">
            <NavItem>
              <NavLink to="/activities">{currentUser.firstName}'s Activities</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/goals">Goals</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/user-update">{currentUser.username}</NavLink>
            </NavItem>
            <NavItem>
              <Link to="/" onClick={() => userLogout()}>Logout</Link>
            </NavItem>
          </Nav>
        ) : (
          <Nav className="mr-auto navbar">
            <NavItem>
              <NavLink to="/login">Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/signup">Signup</NavLink>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </div>
  );
}

export default NavBar;