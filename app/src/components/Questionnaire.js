import React, { useState } from 'react';
import { fetchRecommendedLocations, getCoordinates } from './utils';
import { useHistory } from "react-router-dom";
const Questionnaire = () => {
  const navigate = useHistory();
  const [formData, setFormData] = useState({
    previousAddress: '',
    beds_min: 0,
    baths_min: 0,
    property_type: '',
    mortgageAssistance: 'no',
    max_distance: 0,
    price_range: ''
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
      fetchRecommendedLocations(coords.current_latitude, coords.current_longitude, formData.max_distance)
      .then(data => {
        
        const [min, max] = formData.price_range.split('-');
        navigate.push({pathname:'/search', state: {state: data, filter:
          {
            beds_min: formData.beds_min,
            baths_min: formData.beds_min,
            property_type: formData.property_type,
            max_distance: formData.max_distance,
            price_min: min, price_max: max
          }
        }});
      });
    }).catch(error => console.error('Error:', error));
    //onFormSubmit(formData);
  };

  return (
    <div className="questionnaire-container">
      <h2>Housing Information Questionnaire</h2>
      <form id="house-criteria-form" className="questionnaire-form" onSubmit={handleSubmit}>
        <div className='form-group'>
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
        <div className="form-group">
          <label htmlFor="price_range">What is your current budget?</label>
          <input type='text' id="price_range" name="price_range" placeholder="Enter your price range" value={formData.price_range}
            onChange={handleChange} required />
        </div>
        <div className='form-group'>
        <label>What features do you need in a new home?</label>
        <div className="features-grid">
            <div className="feature-box">
              <label htmlFor="beds">Beds</label>
                <select 
              id="beds_min"
              name="beds_min"
              value={formData.beds_min}
              onChange={handleChange} required>
                <option value="">Select beds</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5">5 Beds or more</option>
              </select>
            </div>
            <div className="feature-box">
              <label htmlFor="baths">Baths</label>
              <select 
                id="baths_min"
                name="baths_min"
                value={formData.baths_min}
                onChange={handleChange} required>
                <option value="">Select baths</option>
                <option value="1">1 Bath</option>
                <option value="2">2 Baths</option>
                <option value="3">3 Baths</option>
                <option value="4">4 Baths or more</option>
              </select>
            </div>
            <div className="feature-box">
              <label htmlFor="home-type">Home Type</label>
              <select 
                id="property_type"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="multi_family">Multi family</option>
                <option value="mobile">Mobile</option>
                <option value="land">Land</option>
                <option value="farm">Farm</option>
                <option value="single_family">Single Family</option>
              </select>
            </div>
        </div>
        </div>
        <div className='form-group'>
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

        <div className='form-group'>
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

        <button type="submit" className='btn btn-lg btn-success'>Submit</button>
      </form>
    </div>
  );
};

export default Questionnaire;