import React from 'react';
import './styles.css';

const StopButton = ({ onStop }) => {
  return (
    <button className="button stop-button" onClick={onStop} alt="directory picker for job description">
    </button>
  );
};

export default StopButton;