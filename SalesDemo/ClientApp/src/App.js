import React, { Component } from "react";
import { Route } from "react-router";
import { ModelPage } from "./components/ModelPage";
import { SalePage } from "./components/SalePage";
import { NavMenu } from "./components/NavMenu";
import { Container} from 'semantic-ui-react';

export default class App extends Component {
  displayName = App.name;

  render() {
    return (
        <Container fluid>
            <NavMenu />
            <Route exact path="/" component={() => <ModelPage model="Product"/>} />
            <Route exact path="/Customer" component={() => <ModelPage model="Customer" />} />
            <Route exact path="/Product" component={() => <ModelPage model="Product" />} />
            <Route exact path="/Store" component={() => <ModelPage model="Store" />} />
            <Route exact path="/Sale" component={() => <SalePage model="Sale"/>} />
        </Container>
    );
  }
}
