import React, { Component } from "react";
import { Route } from "react-router";
import { ModelPage } from "./components/ModelPage";
import { NavMenu } from "./components/NavMenu";

export default class App extends Component {
  displayName = App.name;

  render() {
    return (
        <div>
            <NavMenu />
            <Route exact path="/" component={() => <ModelPage model="Customer"/>} />
            <Route exact path="/Customer" component={() => <ModelPage model="Customer"/>}  />
      </div>
    );
  }
}
