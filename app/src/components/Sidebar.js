import React from 'react';

function Sidebar({ states, onApply }) {
  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight">
      <div className="offcanvas-header">
        <h5>Recommended areas</h5>
        <button className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body">
        <div id="stateList" className="list-group">
          {states.map((state) => (
            <div key={state.name} className="mb-3">
              <h6 className="fw-bold">{state.name}</h6>
              <div className="ms-3">
                {state.cities.map((city) => (
                  <div key={city} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={city}
                      data-state={state.name}
                    />
                    <label className="form-check-label">{city}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-3" onClick={onApply}>
          Apply
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
