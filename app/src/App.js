import React from 'react';
import { useState } from 'react';
import Map from './components/Map';
//import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div>
      <div className="header">
        MaeAway - Safe Home Finder
      </div>
      <div className="results-container">
        <div className="map-section">
          <Map/>
        </div>
        <div className="listings-section" id="listings"></div>
      </div>
      <Map />
  <div className="footer">
    Â© 2024 MaeAway | Find your safe home today
  </div>
    </div>
  );
}