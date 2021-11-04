import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import "./NavBar.css";

function NavBar({userLogout}) {
  const currentUser = false;
  return (
    <div className="container">
      <Navbar expand="ms">
        <NavLink exact to="/" className="navbar-brand">
          My-Strava
        </NavLink>
        {currentUser ? (
          <Nav className="ml-auto navbar">
            <NavItem>
              <NavLink to="/activities">Activities</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/set-goals">Set Goals</NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink to="/detailed-activity">
                Activity Details
              </NavLink>
            </NavItem> */}
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