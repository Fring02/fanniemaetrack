import asyncio
import aiohttp
import geopy.distance
from geopy.geocoders import Nominatim
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import us

app = FastAPI()

class UserInput(BaseModel):
    current_latitude: float
    current_longitude: float


# Function to fetch nearby amenities
async def fetch_nearby_amenities(session, lat, lon, radius=20000):  # Increase radius to 20,000 meters
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      node["amenity"~"hospital"](around:{radius},{lat},{lon});
      node["shop"="supermarket"](around:{radius},{lat},{lon});
      node["leisure"="park"](around:{radius},{lat},{lon});
      node["landuse"="recreation_ground"](around:{radius},{lat},{lon});
    );
    out body;
    """
    
    async with session.post(overpass_url, data={"data": overpass_query}) as response:
        if response.status == 200:
            data = await response.json()
            amenities = {"park": [], "hospital": [], "supermarket": []}
            
            for element in data['elements']:
                if 'tags' in element:
                    if 'amenity' in element['tags'] and element['tags']['amenity'] == 'hospital':
                        amenities["hospital"].append(element)
                    if 'shop' in element['tags'] and element['tags']['shop'] == 'supermarket':
                        amenities["supermarket"].append(element)
                    if 'leisure' in element['tags'] and element['tags']['leisure'] == 'park':
                        amenities["park"].append(element)
                    if 'landuse' in element['tags'] and element['tags']['landuse'] == 'recreation_ground':
                        amenities["park"].append(element)

            return amenities
        else:
            print(f"Error fetching amenities: {response.status}")
            return {}

# Function to fetch NWS alerts for a location
async def fetch_nws_alerts(session, lat, lon):
    nws_url = f"https://api.weather.gov/alerts/active?point={lat},{lon}"
    async with session.get(nws_url) as response:
        if response.status == 200:
            alerts_data = await response.json()
            return alerts_data['features']  # Return the list of alerts
        else:
            print(f"Error fetching NWS alerts: {response.status}")
            return []

# Function to find potential safe relocation points based on proximity
def find_safe_locations(user_lat, user_lon, min_distance_km=5, max_distance_km=20):
    potential_locations = []
    for bearing in range(0, 360, 45):  # Check every 45 degrees (8 directions)
        new_location = geopy.distance.distance(kilometers=min_distance_km).destination((user_lat, user_lon), bearing)
        potential_locations.append((new_location.latitude, new_location.longitude))
    return potential_locations

# Calculate score based on amenities and alerts
def calculate_location_score(amenities, alerts):
    score = 0

    # Weighting the score based on the number of available amenities
    score += len(amenities["hospital"]) * 10  # Hospitals have high importance
    score += len(amenities["supermarket"]) * 8  # Supermarkets are crucial
    score += len(amenities["park"]) * 5  # Parks are beneficial but lower priority
    
    # Penalize based on the number of alerts
    if len(alerts) == 0:
        penalty = 0  # No penalty for no alerts
    elif len(alerts) == 1:
        penalty = 50  # Single alert penalty
    else:
        penalty = 50 + (len(alerts) - 1) * 25  # Additional penalty for extra alerts

    score -= penalty  # Apply penalty to the score
    return score

# Main function to gather user inputs and evaluate locations
@app.post("/recommend-locations")
async def main(user_input: UserInput):
    # Define minimum and maximum relocation distance
    user_lat = user_input.current_latitude
    user_lon = user_input.current_longitude
    min_safe_distance = 5  # km
    max_safe_distance = 20  # km

    # Find potential safe relocation points
    safe_locations = find_safe_locations(user_lat, user_lon, min_safe_distance, max_safe_distance)

    # Store each location with its score in a list
    location_scores = []
    
    async with aiohttp.ClientSession() as session:
        print("Evaluating nearby safe locations...\n")
        fetch_tasks = []
        
        for location in safe_locations:
            lat, lon = location
            fetch_tasks.append(fetch_location_data(session, lat, lon))
        
        results = await asyncio.gather(*fetch_tasks)

        for location_data in results:
            location_scores.append(location_data)

    # Sort locations by score in descending order (highest score first)
    location_scores = sorted(location_scores, key=lambda x: x["score"], reverse=True)

    geolocator = Nominatim(user_agent="my_unique_application_name")
    try:
        global user_location 
        user_location = geolocator.reverse((user_lat, user_lon))
        # print("User's address:", user_location.address)
    except Exception as e:
        print(f"Error fetching user location: {e}")

    dropdown_info = {
        "counties":[

        ], 
        
        "amenities": [

        ],

        "user_location": {
            "city": user_location.raw['address'].get('city', '') or user_location.raw['address'].get('county', ''),
            "address": user_location.raw['address'].get('address'),
            "state": user_location.raw['address'].get('state', '')
        }
    }

    unique_counties = 0
    # Output the top locations with their scores
    # print("Top Recommended Locations:\n")
    try:
        for location_data in location_scores:
            if unique_counties >= 3:
                break

            loc = location_data["location"]
            score = location_data["score"]
            amenities = location_data["amenities"]
            
        
            location = geolocator.reverse((loc[0], loc[1]))
            state = location.raw['address'].get('state', '')
            state_code = state_code = us.states.lookup(state).abbr if state else None
            city_county = location.raw['address'].get('city', '') or location.raw['address'].get('county', '')
            # print("Location Information:")
            # print(f"City/County: {city_county}")
            # print("Location address:", location.address)
            # print(f"Location ({loc[0]}, {loc[1]}) - Score: {score}")
            
            if amenities not in dropdown_info['amenities']:
                dropdown_info['amenities'].append(amenities)

            if city_county not in dropdown_info["counties"]:
                unique_counties += 1
                dropdown_info['counties'].append( {
                    "state": state_code,
                    "county_name": city_county
                }
                )
            # print(f"  Hospitals: {len(amenities['hospital'])}")
            # print(f"  Supermarkets: {len(amenities['supermarket'])}")
            # print(f"  Parks: {len(amenities['park'])}")
            # print(f"  Active Alerts: {len(alerts)}\n")  # Display the number of active alerts
        return dropdown_info
    except Exception as e:
        print(f"Error fetching location: {e}")

# Function to fetch location data (amenities and alerts) for a specific location
async def fetch_location_data(session, lat, lon):
    amenities = await fetch_nearby_amenities(session, lat, lon, radius=15000)  # Increased radius
    nws_alerts = await fetch_nws_alerts(session, lat, lon)

    # Calculate location score based on amenities and alerts
    location_score = calculate_location_score(amenities, nws_alerts)
    
    return {
        "location": (lat, lon),
        "score": location_score,
        "amenities": amenities,
        "alerts": nws_alerts  # Store alerts for reference
    }

# Run the main function
if __name__ == "__main__":
    import json

    with open('example_inputs.json') as f:
        data = json.load(f)

    example = data['examples'][0]
    user_lat = example['current_latitude']
    user_lon = example['current_longitude']
    financial_situation = example['financial_situation']
    has_kids = example['has_kids']
    job_flexibility = example['job_flexibility']

    asyncio.run(main(user_lat, user_lon))
