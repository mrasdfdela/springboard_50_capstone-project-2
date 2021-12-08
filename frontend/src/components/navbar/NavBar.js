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
            <NavItem>
              <NavLink to="/activities">
                {currentUser}'s Activities
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/goals">Goals</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/user-update">{currentUser}</NavLink>
            </NavItem>
            <NavItem>
              <Link 
                to="/" 
                onClick={ ()=> handleLogout() }>
                Logout
              </Link>
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