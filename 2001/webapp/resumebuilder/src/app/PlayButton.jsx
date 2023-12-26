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
       {
        isRecording ? <div>Stop <div className="loading-circle" styles={{display: 'inline-flex',
          margin: 'auto',
          padding: '8px',
          marginLeft: '10px',
          marginTop: '0px',
          marginBottom: '-5px'}}></div></div>: 'Record'
      }
    </button>
  );
};

export default PlayButton;