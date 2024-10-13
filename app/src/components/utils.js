async function getCoordinates(address) {  
    const apiKey = 'AIzaSyCGJpwrHFi0zoh-ah89w-xIRtK8jGn0zDo'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return { current_latitude: lat, current_longitude: lng };
      } else {
        throw new Error(`Geocoding failed: ${data.status}`);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  }
  
async function fetchRecommendedLocations(current_latitude, current_longitude, max_distance) {
    const url = `http://localhost:8000/recommend-locations`;
    let body = {
      current_longitude,
      current_latitude,
      max_distance: max_distance,
    };
    //1600 Amphitheatre Parkway, Mountain View, CA
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching recommended locations:', error);
    }
  }
  



export {getCoordinates, fetchRecommendedLocations};