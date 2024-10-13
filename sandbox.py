import geopandas as gpd
from shapely.geometry import Point

geojson = gpd.read_file('riskdata.geojson')

def fetch_risk_score(lat, lon):
    location_point = Point(lon, lat)
    for _, row in geojson.iterrows():
        if location_point.within(row.geometry):
            risk_score = row['RISK_SCORE']
            print(f"The risk score for the given location is: {risk_score}")
            return risk_score
        
        else:
            print("The given location does not fall within any risk area.")


fetch_risk_score(27.964157, -82.452606)
