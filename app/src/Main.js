import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Questionnaire from "./components/Questionnaire";
import App from "./App";

export default function Main() {
  return (
    <BrowserRouter>
      <Switch>
        {/* Root path renders the Questionnaire component */}
        <Route exact path="/" component={Questionnaire} />
        {/* Nested route for /search renders the App component */}
        <Route path="/search" component={App} />
      </Switch>
    </BrowserRouter>
  );
}
