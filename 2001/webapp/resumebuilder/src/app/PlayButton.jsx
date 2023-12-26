import React from 'react';
import './styles.css';

const PlayButton = ({ onPlay }) => {
  return (
    <button className="button play-button" onClick={onPlay}>
      Play
    </button>
  );
};

export default PlayButton;