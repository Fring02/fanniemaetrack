function displayLocations(states, onCheckCounty, filter) {
  const stateList = document.getElementById('listings');
  
  // Temporarily store the #fannie element
  const fannieDiv = document.getElementById('fannie');
  
  // Clear everything except the #fannie div
  stateList.innerHTML = ''; // Clear all content
  stateList.appendChild(fannieDiv); // Re-add the #fannie div
  

  filter.global.forEach(state => {
    // Create a state container
    const stateContainer = document.createElement('div');
    stateContainer.classList.add('state-container');

    // Create a state header item
    const stateHeader = document.createElement('h2');
    stateHeader.classList.add('state-header');
    stateHeader.textContent = state.name;
    stateContainer.appendChild(stateHeader);

    // Create a grid for cities
    const cityGrid = document.createElement('div');
    cityGrid.classList.add('city-grid');

    // Create a list of cities with checkboxes under the state header
    state.cities.forEach(city => {
      const cityItem = document.createElement('div');
      cityItem.classList.add('city-item');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = states.some(
        (s) => s.name === state.name && s.cities.includes(city)
      );
      checkbox.classList.add('city-checkbox');
      checkbox.value = `${city},${state.name}`;
      checkbox.id = `${city},${state.name}`;
      checkbox.dataset.state = state.name;
      checkbox.onclick = onCheckCounty;

      const label = document.createElement('label');
      label.htmlFor = `${city},${state.name}`;
      label.textContent = city;

      cityItem.appendChild(checkbox);
      cityItem.appendChild(label);
      cityGrid.appendChild(cityItem);
    });

    stateContainer.appendChild(cityGrid);
    stateList.appendChild(stateContainer);
  });
}

export default displayLocations;