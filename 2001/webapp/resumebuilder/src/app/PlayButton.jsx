import React, { useState, useEffect } from 'react';

const PlayButton = ({ onPlay }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleClick = () => {
    if (isRecording) {
      setIsRecording(false);
      setShowLoading(true);
    } else {
      setShowLoading(false);
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (showLoading) {
      const randomDuration = Math.floor(Math.random() * 1000) + 500; // Random duration between 500ms and 1500ms

      const timer = setTimeout(() => {
        setShowLoading(false);
        onPlay();
      }, randomDuration);

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts or is re-rendered
    }
  }, [showLoading, onPlay]);

  return (
    <button className={`button play-button ${isRecording ? 'recording' : ''}`} onClick={handleClick}>
      {showLoading ? (
        <div className="loading-circle"></div>
      ) : (
        isRecording ? 'Stop' : 'Record'
      )}
    </button>
  );
};

export default PlayButton;