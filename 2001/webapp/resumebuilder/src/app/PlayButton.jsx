import React, { useState, useEffect } from 'react';

const PlayButton = ({ onPlay, onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handleClick = () => {
    if (isRecording) {
      setIsRecording(false);
      onStop(); // Call the stop callback
    } else {
      setIsRecording(true);
      onPlay();
    }
  };

  useEffect(() => {
    // If 'showLoading' is true, start the loading animation
    let timer;
    if (showLoading) {
      timer = setTimeout(() => {
        setShowLoading(false);
      }, 1000); // Adjust the duration as needed
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showLoading]);

  return (
    <button
      className={`button play-button ${isRecording ? 'recording' : ''}`}
      onClick={handleClick}
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
      {showLoading ? (
        <div className="loading-circle"></div>
      ) : (
        isRecording ? 'Stop' : 'Record'
      )}
    </button>
  );
};

export default PlayButton;