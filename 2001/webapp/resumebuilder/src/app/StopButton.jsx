import React from 'react';
import './styles.css';

const StopButton = ({ onStop }) => {
  return (
    <button className="button stop-button" onClick={onStop}>
    </button>
  );
};

export default StopButton;