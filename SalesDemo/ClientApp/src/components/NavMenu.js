import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    displayName = NavMenu.name

    render() {
        return (
            <>
                <NavLink to="/Customer">Customer</NavLink>
                |
              <NavLink to="/Product">Product</NavLink>
                |
              <NavLink to="/Store">Store</NavLink>
                |
              <NavLink to="/Sale">Sale</NavLink>
            </>
        );
    }
}
