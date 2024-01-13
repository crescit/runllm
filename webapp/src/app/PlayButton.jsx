import React, { useState, useEffect } from 'react';
import styles from './styles.css'
import { useQuestions } from './context/QuestionContext';

const PlayButton = ({ onPlay, onStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { questions, currentQuestion, updateCurrentQuestion } = useQuestions();

  const handleNext = () => {
    if (questions.length > 0) {
      const currentIndex = questions.findIndex(question => question.text === currentQuestion);
      const nextIndex = (currentIndex + 1) % questions.length;
      updateCurrentQuestion(questions[nextIndex].text);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      setIsRecording(false);
      onStop(); // Call the stop callback
      handleNext()
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