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
      <div className="d-flex p-3 bg-light">
        <h1>MaeAway</h1>
        <div className="container d-flex justify-content-end">
          <button
            className="btn btn-light"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/9293/9293128.png"
              width="30"
              height="30"
              alt="Menu"
            />
          </button>
          <Sidebar states={states} onApply={handleApply} />
        </div>
      </div>
      <Map />
    </div>
  );
}