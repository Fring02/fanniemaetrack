function displayLocations(states){
  alert(JSON.stringify(states))
    const stateList = document.getElementById('listings');
    states.forEach(state => {
      // Create a state header item
      const stateHeader = document.createElement('div');
      stateHeader.classList.add('list-group-item', 'fw-bold');
      stateHeader.textContent = state.name;
      stateList.appendChild(stateHeader);
  
      // Create a list of cities with checkboxes under the state header
      state.cities.forEach(city => {
        const cityItem = document.createElement('label');
        cityItem.classList.add('list-group-item');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input', 'me-1');
        checkbox.value = city;
        checkbox.dataset.state = state.name;
  
        cityItem.appendChild(checkbox);
        cityItem.appendChild(document.createTextNode(city));
        stateList.appendChild(cityItem);
      });
    });``
}

export {displayLocations};