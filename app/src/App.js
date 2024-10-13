import React from 'react';
import { useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';

export default function App() {
const states = [
  { name: 'CA', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
  { name: 'NY', cities: ['New York', 'Buffalo', 'Rochester'] },
  { name: 'VA', cities: ['Fairfax', 'Arlington', 'Richmond'] },
];
  const [selectedCities, setSelectedCities] = useState([]);

  const handleApply = () => {
    const selected = Array.from(
      document.querySelectorAll('#stateList input:checked')
    ).map((input) => ({
      state: input.dataset.state,
      city: input.value,
    }));
    setSelectedCities(selected);
  };

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