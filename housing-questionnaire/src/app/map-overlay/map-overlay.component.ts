/// <reference types="@types/google.maps" />
// map-overlay.component.ts
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

interface DisasterHotspot {
  lat: number;
  lng: number;
  type: string;
  description: string;
  severity: string;
  headline: string;
}

@Component({
  selector: 'app-map-overlay',
  standalone: true,
  template: `
    
        <h1>Interactive Housing and Disaster Map</h1>
        <div #mapContainer id="map" style="height: 90vh; width: 100%;"></div>

  `,
  styles: [`
    #map {
      height: 90vh;
      width: 100%;
    }

        #controls {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 10px;
      border-radius: 5px;
      z-index: 1001;
    }

    #controls button {
      margin: 5px;
      padding: 10px;
      font-size: 14px;
    }
  `],
  imports: [CommonModule]
})
export class MapOverlayComponent implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  ngOnInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initMap();
    });
  }

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=key=AIzaSyCGJpwrHFi0zoh-ah89w-xIRtK8jGn0zDo&callback=initMap&libraries=visualization`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  initMap() {
    const map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 38.8462, lng: -77.3064 }, // GMU
      zoom: 10,
    });

    this.fetchHousingListings().then(housingData => {
      this.displayHousingListings(map, housingData);
    }).catch(error => console.error("Error loading data:", error));

    this.fetchDisasterHotspots().then(disasterData => {
      this.displayDisasterHotspots(map, disasterData);
    }).catch(error => console.error("Error loading disaster data:", error))
  }

  async fetchHousingListings() {
    const url = 'https://us-real-estate.p.rapidapi.com/v3/for-sale?state_code=FL&city=Tampa&sort=newest&offset=0&limit=42';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'ed8586b3cfmsh3061e0b328c10ffp14a91bjsn561a5393a476',
        'x-rapidapi-host': 'us-real-estate.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    return response.json();
  }
  
  async fetchDisasterHotspots() {
    const url = 'https://api.weather.gov/alerts/active?area=FL';  // Change 'FL' to any state or area
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      console.log(data);  // Log disaster data for debugging
  
      return data.features
        .map((feature: any) => {
          const { geometry, properties } = feature;
  
          // Handle different geometry types
          if (geometry && geometry.type === "Polygon") {
            const [firstCoordinate] = geometry.coordinates[0]; // Extract first point from the polygon
            return {
              lat: firstCoordinate[1], // Latitude
              lng: firstCoordinate[0], // Longitude
              type: properties.event,
              description: properties.description,
              severity: properties.severity,
              headline: properties.headline,
            };
          } else if (geometry && geometry.type === "Point") {
            return {
              lat: geometry.coordinates[1], // Latitude
              lng: geometry.coordinates[0], // Longitude
              type: properties.event,
              description: properties.description,
              severity: properties.severity,
              headline: properties.headline,
            };
          } else {
            return null;  // Ignore entries with unsupported or missing geometry
          }
        })
        .filter((entry: DisasterHotspot | null): entry is DisasterHotspot => entry !== null);  // Remove null entries
    } catch (error) {
      console.error("Error fetching disaster hotspots:", error);
      return [];
    }
  }

  displayDisasterHotspots(map: google.maps.Map, disasterData: any) {
    if (disasterData.length === 0) {
        console.warn("No disaster hotspots to display.");
        return;
    }

    const heatmapPoints = disasterData.map((disaster: { lat: number | google.maps.LatLng | google.maps.LatLngLiteral; lng: number | boolean | null | undefined; }) => 
        new google.maps.LatLng(disaster.lat, disaster.lng)
    );

    const disasterHeatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapPoints,
        map: map,
        radius: 20,
        opacity: 0.6,
        gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
        ]
    });
  }


  displayHousingListings(map: google.maps.Map, response: any) {
    const listings = response.data.home_search.results;

    listings.forEach((listing: any) => {
      const coordinates = listing.location.address.coordinate;
      const marker = new google.maps.Marker({
        position: { lat: coordinates.lat, lng: coordinates.lon },
        map: map,
        title: `${listing.location.address.line}, ${listing.location.address.city}, ${listing.location.address.state_code}`,
      });

      const infoWindowContent = `
        <div style="max-width: 300px;">
          <h3>${listing.location.address.line}</h3>
          <p>${listing.location.address.city}, ${listing.location.address.state_code} ${listing.location.address.postal_code}</p>
          <p><strong>Price:</strong> $${listing.list_price.toLocaleString()}</p>
          <p><strong>Beds:</strong> ${listing.description.beds}, <strong>Baths:</strong> ${listing.description.baths_consolidated}</p>
          
          <img src="${listing.primary_photo.href}" alt="Property Image" style="width:100%; height:auto;"/>
          <a href="https://www.realtor.com/realestateandhomes-detail/${listing.permalink}" target="_blank">View Details</a>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  }
  
  
  
}
