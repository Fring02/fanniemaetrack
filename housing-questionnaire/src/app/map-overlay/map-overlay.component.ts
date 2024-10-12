/// <reference types="@types/google.maps" />
// map-overlay.component.ts
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
      script.src = `https://maps.googleapis.com/maps/api/js?key=key=AIzaSyCGJpwrHFi0zoh-ah89w-xIRtK8jGn0zDo&callback=initMap`;
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
      zoom: 25,
    });

    this.fetchHousingListings().then(housingData => {
      this.displayHousingListings(map, housingData);
    }).catch(error => console.error("Error loading data:", error));
  }

  async fetchHousingListings() {
    const url = 'https://us-real-estate.p.rapidapi.com/v3/for-sale?state_code=MI&city=Detroit&sort=newest&offset=0&limit=42';
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
          <p><strong>Sqft:</strong> ${listing.description.sqft.toLocaleString()}</p>
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
