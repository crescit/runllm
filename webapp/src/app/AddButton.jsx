import React from 'react';
import './styles.css';

const AddButton = ({ onStop }) => {
  return (
    <button className="button add-button" onClick={onStop} alt="directory picker for job description">
    </button>
  );
};

export default AddButton;