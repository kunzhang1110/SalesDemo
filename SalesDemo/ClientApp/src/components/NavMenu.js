import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  displayName = NavMenu.name

  render() {
      return (
          <NavLink to="/Customer">Customer</NavLink>
    );
  }
}
