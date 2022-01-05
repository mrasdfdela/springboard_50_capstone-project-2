import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
});