import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { json, useLocation } from 'react-router-dom';
import { displayHousingListings, fetchHousingListings } from '../housing';
import displayLocations from '../locations';
function getRiskColor(riskScore) {
  return riskScore > 95
    ? '#FF0000'  // 80-100% (High Risk - Red)
    : (riskScore > 90 && riskScore < 95)
    ? '#FF4500'  // 60-80% (Moderate-High Risk - OrangeRed)
    : (riskScore > 87 && riskScore < 90)
    ? '#FFA500'  // 40-60% (Moderate Risk - Orange)
    : (riskScore > 83 && riskScore < 87)
    ? '#FFFF00'  // 20-40% (Low Risk - Yellow)
    : '#00FF00'; // 0-20% (Minimal Risk - Green)
}

function Map() {
  const mapRef = useRef(null); // Ref to the map div
  const location = useLocation();
  function getCounties(counties){
    const stateCityMap = {};
     counties.forEach(({ state, county_name }) => {
        if (!stateCityMap[state]) {
          stateCityMap[state] = new Set(); // Use Set to avoid duplicate cities
        }
        stateCityMap[state].add(county_name);
      });
      const states = Object.entries(stateCityMap).map(([state, citiesSet]) => ({
        name: state,
        cities: Array.from(citiesSet),
      }));
      return states;
  }
  const [filter, setFilter] = useState(() => {
    let s = getCounties(location.state.state.counties);
    return {
      states: s,
      filter: location.state.filter,
      global: s
    };
  });
  useEffect(() => {
    // Dynamically load the Google Maps API script
    const loadGoogleMapsScript = () => {
      const existingScript = document.getElementById('googleMaps');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCGJpwrHFi0zoh-ah89w-xIRtK8jGn0zDo&callback=initMap`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      } else {
        // If script is already loaded, call the init function directly
        if (window.google) {
          initMap();
        }
      }
    };

    // Attach initMap to the window object
    window.initMap = initMap;

    // Load the script
    loadGoogleMapsScript();

    // Cleanup: Remove script when the component unmounts
    return () => {
      const script = document.getElementById('googleMaps');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [filter]);

function loadGeoJsonData(map){
  return new Promise((resolve, reject) => {
    map.data.loadGeoJson('http://localhost:8080/riskdata.geojson', {}, () => {
      // Apply styling to each feature
      map.data.setStyle((feature) => {
        const riskScore = Math.round(feature.getProperty('RISK_SCORE'));
        return {
          fillColor: getRiskColor(riskScore),
          fillOpacity: 0.5,
          strokeColor: '#000',
          strokeWeight: 1,
        };
      });

      // Register the click event listener inside the loadGeoJson callback
      map.data.addListener('click', (event) => {
        const county = event.feature.getProperty('COUNTY');
        const state = event.feature.getProperty('STATE');
        const riskScore = Math.round(event.feature.getProperty('RISK_SCORE'));

        const content = `
          <div>
            <h3>County: ${county}</h3>
            <p>State: ${state}</p>
            <p>Risk Score: ${riskScore}</p>
          </div>
        `;
        const infoWindow = new window.google.maps.InfoWindow({
          content: content,
          position: event.latLng,
        });

        infoWindow.open(map);
      });

      // Resolve the promise when GeoJSON loading completes
      resolve();
    });
  });
}

  function onCheckCounty(e){
    e.preventDefault();
    const checkbox = e.target;
    const value = checkbox.value.split(',');
    let name = value[1], city = value[0];
    if(checkbox.checked){
      setFilter((prevState) => {
        // Create a new array by mapping through the states and filtering the cities
        const updatedStates = prevState.states.map((state) => {
          if (state.name === name) {
            state.cities.push(city);
            return {
              ...state,
              cities: state.cities // Remove the specific city
            };
          }
          return state; // Return the state as-is if it doesn't match
        }).filter(state => state.cities.length > 0); // Optional: Remove states with no cities left
    
        return { ...prevState, states: updatedStates };
      });
      console.log(filter);
    } else {
      setFilter((prevState) => {
        // Create a new array by mapping through the states and filtering the cities
        const updatedStates = prevState.states.map((state) => {
          if (state.name === name) {
            return {
              ...state,
              cities: state.cities.filter((c) => c !== city) // Remove the specific city
            };
          }
          return state; // Return the state as-is if it doesn't match
        }).filter(state => state.cities.length > 0); // Optional: Remove states with no cities left
    
        return { ...prevState, states: updatedStates };
      });
      console.log(filter);
    }
  }

  function initMap() {
    let housingMarkers = [];
    if (mapRef.current) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: location.state.filter.lat, lng: location.state.filter.lng },
        zoom: 10,
        mapTypeId: 'terrain',
      });
     let states = filter.states;

     const marker = new window.google.maps.Marker({
      position: { lat: location.state.filter.lat, lng: location.state.filter.lng },
      map: map,
      icon: {
          scaledSize: new window.google.maps.Size(48, 48), // Adjust size
        }
      });

      displayLocations(states, onCheckCounty, filter);
      // Load GeoJSON and housing data
        Promise.all([fetchHousingListings(states, filter.filter), loadGeoJsonData(map)])
        .then(([housingData]) => {
            housingData.flat().forEach(response => {
                displayHousingListings(map, housingMarkers, response);
            });
        })
        .catch((error) => console.error("Error loading data:", error));
    }
  }

  return <div ref={mapRef} id="map" style={{ height: '90vh', width: '100%' }}></div>;
}

export default Map;
