import React, { Component } from "react";
import { Route } from "react-router";
import { CustomerPage } from "./components/CustomerPage";
import { CustomerForm } from "./components/CustomerForm";
import { NavMenu } from "./components/NavMenu";

export default class App extends Component {
  displayName = App.name;

  render() {
    return (
        <div>
            <NavMenu />
            <Route exact path="/" component={CustomerPage} />
            <Route exact path="/Customer" component={CustomerPage} />
      </div>
    );
  }
}
