async function fetchHousingListings(states) {
    for(let state in states){
        let code = state.name;
        let cities = state.cities.join(',');
        //`
        const url = `https://us-real-estate.p.rapidapi.com/v3/for-sale?state_code=${code}&city=${cities}&sort=newest&offset=0&limit=42`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'ed8586b3cfmsh3061e0b328c10ffp14a91bjsn561a5393a476',
            'x-rapidapi-host': 'us-real-estate.p.rapidapi.com'
          }
        };
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return {};
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("Error fetching housing listings:", error);
          return {};  // Return an empty object on error
        }
    }
}


// Display housing listings on the map
function displayHousingListings(response) {
        if (!response.data || !response.data.home_search) {
          console.error("Invalid housing data format:", response);
        return;
        }

        const listings = response.data.home_search.results;

        listings.forEach((listing) => {
        const coordinates = listing.location.address.coordinate;

        const marker = new google.maps.Marker({
            position: { lat: coordinates.lat, lng: coordinates.lon },
            map: map,
            title: `${listing.location.address.line}, ${listing.location.address.city}, ${listing.location.address.state_code}`,
        });

        const imageSrc = listing.primary_photo ? listing.primary_photo.href : 'https://via.placeholder.com/150';

        const infoWindowContent = `
        <div style="max-width: 300px;">
        <h3>${listing.location.address.line}</h3>
        <p>${listing.location.address.city}, ${listing.location.address.state_code} ${listing.location.address.postal_code}</p>
        <p><strong>Price:</strong> $${listing.list_price.toLocaleString()}</p>
        <p><strong>Beds:</strong> ${listing.description.beds}, <strong>Baths:</strong> ${listing.description.baths_consolidated}</p>
        <p><strong>Sqft:</strong> ${(listing.description.sqft !== null) ? listing.description.sqft.toLocaleString() : "Unavailable"}</p>
        <img src="${imageSrc}" alt="Property Image" style="width:100%; height:auto;"/>
        <a href="https://www.realtor.com/realestateandhomes-detail/${listing.permalink}" target="_blank">View Details</a>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    housingMarkers.push(marker);
    });
}