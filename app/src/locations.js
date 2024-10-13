function displayLocations(states, onCheckCounty, filter){
    const stateList = document.getElementById('listings');
    stateList.innerHTML = '';
    filter.global.forEach(state => {
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
        checkbox.checked = states.some(
          (s) => s.name === state.name && s.cities.includes(city)
        );
        checkbox.classList.add('form-check-input', 'me-1');
        checkbox.value = city + ',' + state.name;
        checkbox.id = city + ',' + state.name;
        checkbox.dataset.state = state.name;
        checkbox.onclick = onCheckCounty;
        cityItem.appendChild(checkbox);
        cityItem.appendChild(document.createTextNode(city));
        stateList.appendChild(cityItem);
      });
    });
}

export default displayLocations;