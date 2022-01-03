import React, {useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

import UserContext from "../../contexts/UserContext";
import "./NavBar.css";
const user = require("../../helpers/user");

function NavBar() {
  const { 
    currentUser,
    setCurrentUser, 
    setCurrentToken 
  } = useContext(UserContext);

  const handleLogout = ()=> {
    user.default.userLogout();
    setCurrentUser(null);
    setCurrentToken(null);
  }

  return (
    <div className="container">
      <Navbar expand="ms">
        <NavLink exact to="/" className="navbar-brand">
          My-Strava
        </NavLink>
        {currentUser ? (
          <Nav className="ml-auto navbar">
            <NavItem className="mx-2">
              <NavLink to="/activities">
                {currentUser}'s Activities
              </NavLink>
            </NavItem>
            <NavItem className="mx-2">
              <NavLink to="/goals">Goals</NavLink>
            </NavItem>
            <NavItem className="mx-2">
              <NavLink to="/user-update">{currentUser}</NavLink>
            </NavItem>
            <NavItem className="mx-2">
              <Link 
                to="/login"
                onClick={ ()=> handleLogout() }>
                Logout
              </Link>
            </NavItem>
          </Nav>
        ) : (
          <Nav className="mr-auto navbar">
            <NavItem className="mx-2">
              <NavLink to="/login">Login</NavLink>
            </NavItem>
            <NavItem className="mx-2">
              <NavLink to="/signup">Signup</NavLink>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </div>
  );
}

export default NavBar;