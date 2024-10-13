import React, { useState } from 'react';
import { fetchRecommendedLocations, getCoordinates } from './utils';
import { useHistory } from "react-router-dom";
const Questionnaire = ({ onFormSubmit }) => {
  const navigate = useHistory();
  const [formData, setFormData] = useState({
    previousAddress: '',
    beds_min: 0,
    baths_min: 0,
    property_type: '',
    mortgageAssistance: 'no',
    max_distance: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Usage example
    getCoordinates(formData.previousAddress).then(coords => {
      console.log('Coordinates:', coords);
      fetchRecommendedLocations(coords.current_latitude, coords.current_longitude, formData.max_distance)
      .then(data => {
        alert(JSON.stringify(data));
        navigate.push({pathname:'/search', state: {state: data}});
      });
    }).catch(error => console.error('Error:', error));
    //onFormSubmit(formData);
  };

  return (
    <div className="questionnaire-container">
      <h2>Housing Information Questionnaire</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="previousAddress">Previous Address:</label>
          <input
            id="previousAddress"
            name="previousAddress"
            type="text"
            placeholder="Enter your previous address"
            value={formData.previousAddress}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="beds_min">Number of Beds:</label>
          <select
            id="beds_min"
            name="beds_min"
            value={formData.beds_min}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4 Beds</option>
            <option value="5">5+ Beds</option>
          </select>
        </div>

        <div>
          <label htmlFor="baths_min">Number of Baths:</label>
          <select
            id="baths_min"
            name="baths_min"
            value={formData.baths_min}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="1">1 Bath</option>
            <option value="1.5">1.5 Baths</option>
            <option value="2">2 Baths</option>
            <option value="2.5">2.5 Baths</option>
            <option value="3">3+ Baths</option>
          </select>
        </div>

        <div>
          <label htmlFor="property_type">Home Type:</label>
          <select
            id="property_type"
            name="property_type"
            value={formData.property_type}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="multi_family">Multi family</option>
            <option value="mobile">Mobile</option>
            <option value="land">Land</option>
            <option value="farm">Farm</option>
            <option value="single_family">Single Family</option>
          </select>
        </div>

        <div>
          <label>Mortgage Assistance Needed:</label>
          <div>
            <label>
              <input
                type="radio"
                name="mortgageAssistance"
                value="yes"
                checked={formData.mortgageAssistance === 'yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="mortgageAssistance"
                value="no"
                checked={formData.mortgageAssistance === 'no'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="max_distance">Preferred Distance to Move (in miles):</label>
          <input
            id="max_distance"
            name="max_distance"
            type="number"
            placeholder="e.g., 50"
            value={formData.max_distance}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Questionnaire;