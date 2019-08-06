import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import './NavMenu.css';

export class NavMenu extends Component {
    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })



    render() {
        const { activeItem } = this.state;

        return (
            <Menu stackable inverted>
                <Menu.Item
                    id="brand"
                    name='Home'
                    active={activeItem === 'Home'}
                    onClick={this.handleItemClick}
                    as={NavLink}
                    exact to="/"
                    content="Home"
                />              
                <Menu.Item
                    name='Customer'
                    active={activeItem === 'Customer'}
                    onClick={this.handleItemClick}
                    as={NavLink}
                    to="/Customer"
                    content="Customer"
                />
                <Menu.Item
                    name='Product'
                    active={activeItem === 'Product'}
                    onClick={this.handleItemClick}
                    as={NavLink}
                    to="/Product"
                    content="Product"
                />
                <Menu.Item
                    name='Store'
                    active={activeItem === 'Store'}
                    onClick={this.handleItemClick}
                    as={NavLink}
                    to="/Store"
                    content="Store"
                />
                <Menu.Item
                    name='Sale'
                    active={activeItem === 'Sale'}
                    onClick={this.handleItemClick}
                    as={NavLink}
                    to="/Sale"
                    content="Sale"
                />
            </Menu>
        );
    }
}
