async function fetchHousingListings(states, filter) {
  const fetchPromises = states.flatMap((state) => {
    const code = state.name;
    return state.cities.map((city) => {
      const url = `https://us-real-estate.p.rapidapi.com/v3/for-sale?state_code=${code}&city=${city}&beds_min=${filter.beds_min}&baths_min=${filter.baths_min}&property_type=${filter.property_type}&price_min=${filter.price_min}&price_max=${filter.price_max}&sort=newest&offset=0&limit=42`;
    
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': 'ed8586b3cfmsh3061e0b328c10ffp14a91bjsn561a5393a476',
          'x-rapidapi-host': 'us-real-estate.p.rapidapi.com'
        }
      };

      // Return a fetch promise for each city
      return fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error(`Error fetching listings for ${city}, ${code}:`, error);
          return null;  // Return null to indicate a failed request
        });
    });
  });
  try {
    const results = await Promise.all(fetchPromises);
    const validResults = results.filter((result) => result !== null);  // Filter out failed requests
    return validResults;
  } catch (error) {
    console.error('Error fetching all listings:', error);
    return [];
  }
}



// Display housing listings on the map
function displayHousingListings(map, housingMarkers, response) {
        if (!response.data || !response.data.home_search.count) {
          console.error("Invalid housing data format:", response);
            return;
        }
        const listings = response.data.home_search.results;
        listings.forEach((listing) => {
        const coordinates = listing.location.address.coordinate;
        const marker = new window.google.maps.Marker({
            position: { lat: coordinates.lat, lng: coordinates.lon },
            map: map,
            title: `${listing.location.address.line}, ${listing.location.address.city}, ${listing.location.address.state_code}`,
            icon: {
                url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpKZO2RGZy5fvT2cJWSFQfaK4LM-wtQWSY6w&shttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4yXgYP6ChV78K5ec3x9pOZPyTKhRYb_3pKA&shttps://static.thenounproject.com/png/658934-200.png', // Custom house icon URL
                scaledSize: new window.google.maps.Size(16, 16), // Adjust size
              }
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

    const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    housingMarkers.push(marker);
    });
}

export {displayHousingListings, fetchHousingListings};