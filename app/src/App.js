import React, { useEffect, useState } from 'react';
import Map from './components/Map';

export default function App() {
  const states = [
    { name: 'CA', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
    { name: 'NY', cities: ['New York', 'Buffalo', 'Rochester'] },
    { name: 'VA', cities: ['Fairfax', 'Arlington', 'Richmond'] },
  ];

  const [selectedCities, setSelectedCities] = useState([]);
  const [loanPrograms, setLoanPrograms] = useState('Loading Fannie Mae loan programs...');

  const handleApply = () => {
    const selected = Array.from(
      document.querySelectorAll('#stateList input:checked')
    ).map((input) => ({
      state: input.dataset.state,
      city: input.value,
    }));
    setSelectedCities(selected);
  };

  useEffect(() => {
    fetchLoanPrograms();
  }, []);

  const fetchLoanPrograms = async () => {
    try {
      const programs = `
        <ul style="font-size: 1.2rem; line-height: 1.8;">
          <li><a href="https://singlefamily.fanniemae.com/media/document/pdf/homeready-matrix-020523" target="_blank">HomeReady® Mortgage</a>: Low down payment option with flexible funding sources.</li>
          <li><a href="https://singlefamily.fanniemae.com/media/document/pdf/homestyle-renovation-product-matrix" target="_blank">HomeStyle® Renovation</a>: Combine home purchase and renovation into one loan.</li>
          <li><a href="https://singlefamily.fanniemae.com/" target="_blank">HomeStyle® Energy</a>: Finance energy-efficient upgrades and disaster resilience improvements.</li>
          <li><a href="https://yourhome.fanniemae.com/" target="_blank">MH Advantage®</a>: Affordable financing options for manufactured homes with lower interest rates.</li>
          <li><a href="https://singlefamily.fanniemae.com/" target="_blank">HFA Preferred™ Loan</a>: Collaborates with local agencies for down payment assistance.</li>
          <li><a href="https://yourhome.fanniemae.com/" target="_blank">RefiNow™ Program</a>: Refinance existing mortgages with lower payments.</li>
          <li><a href="https://singlefamily.fanniemae.com/" target="_blank">97% LTV Options</a>: Purchase a home with only 3% down payment.</li>
        </ul>
        <h3 style="font-size: 1.4rem; margin-top: 1rem;">Homeownership Education</h3>
        <p style="font-size: 1.1rem;">Complete the <a href="https://yourhome.fanniemae.com/" target="_blank">HomeView® Course</a> to learn more about the path to homeownership.</p>
      `;
      setLoanPrograms(programs);
    } catch (error) {
      console.error('Error fetching loan programs:', error);
      setLoanPrograms('<p style="font-size: 1.2rem;">Unable to load loan programs. Please try again later.</p>');
    }
  };

  return (
    <div>
      <div className="header bg-light text-dark" style={{ fontSize: '2rem', padding: '1rem' }}>
        MaeAway - Safe Home Finder
      </div>
      <div className="results-container" style={{ display: 'flex', flexDirection: 'row' }}>
        <div className="map-section" style={{ flex: 2 }}>
          <Map />
        </div>
        <div className="listings-section" id="listings" style={{ flex: 1, padding: '1rem' }}>
          <div id="fannie">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Fannie Mae Loan Programs</h2>
            <div
              id="loan-programs"
              dangerouslySetInnerHTML={{ __html: loanPrograms }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
