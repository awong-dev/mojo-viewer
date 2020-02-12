import React from 'react';

function Control({data, onChange}) {
  return (
    <div>
      <label htmlFor="search-box">Report Type:</label>
      <input type="text" name="search-box" onChange={onChange} />
    </div>
  );
}

export default Control;
