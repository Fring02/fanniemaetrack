import React from 'react';
import { useEffect } from 'react';
import { getRiskColor } from './utils';
function Map() {
  useEffect(() => {
    window.initMap = initMap;
  }, []);

  function initMap() {
    
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 38.8462, lng: -77.3064 },
      zoom: 15,
      mapTypeId: 'terrain',
    });

    // Load and display GeoJSON data
    map.data.loadGeoJson('/riskdata.geojson', {}, () => {
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
        const infoWindow = new google.maps.InfoWindow({
          content: content,
          position: event.latLng,
        });

        infoWindow.open(map);
      });

      // Resolve the promise when GeoJSON loading completes
      resolve();
    });
  }

  return <div id="map" style={{ height: '90vh', width: '100%' }}></div>;
}

export default Map;
