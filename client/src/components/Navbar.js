import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/AuthSlice";
const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Link to='/addExpense'>
          <Navbar.Brand >ur-expense</Navbar.Brand>
          </Link>
          
          <Navbar.Text>expenses</Navbar.Text>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <NavLink to="/">
              {isLoggedIn && (
                <Navbar.Text onClick={() => dispatch(logout())}>
                  Logout
                </Navbar.Text>
              )}
            </NavLink>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
