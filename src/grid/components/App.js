import React, { useRef, useEffect, useState, useCallback } from "react";
import { HashRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'jquery/dist/jquery.js';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect"; 
import gridlogo from"../../buttons/grid.png";
import viewlogo from"../../buttons/vis.png";
import VisApp from "../../vis/components/VisApp";
import GridApp from "../../grid/components/GridApp"


const App = () => {
    return (
      <Router>
        <Home />
        <Switch>
        <Route exact path="/" component={GridApp}/>
        <Route exact path="/vis" component={VisApp}/>
        </Switch>
      </Router>
  )
}

const Home = () => (
  <div className="navButtonsContainer">
    <Link to='/vis'>
    <a id="visLink">
    <img src={viewlogo} alt="vis view" className="navButtons" id="visNav"></img>
    </a>
    </Link>
    <Link to='/'>
    <a id="gridLink">
      <img src= {gridlogo} alt="grid view" className="navButtons" id="gridNav"></img>
    </a>
    </Link>
  </div>
)

export default App;
