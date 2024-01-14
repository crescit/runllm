import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles.css'
import { useQuestions } from './context/QuestionContext';
import { v4 as uuidv4 } from 'uuid';
import { apiServerUrl } from './globals';
import { useSpeechRecognition } from 'react-speech-kit';

const PlayButton = ({ userID }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { questions, currentQuestion, updateCurrentQuestion } = useQuestions();
  const [answer, setAnswer] = useState('')

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      // Handle the recognized speech result
      console.log('Speech Recognized:', result, answer, result.indexOf(answer));
      console.log(result)
      setAnswer(result)
    },
  });

  const onRecord = () => {
    listen();
  };

  const handleNext = () => {
    if (questions.length > 0) {
      const currentIndex = questions.findIndex(question => question.text === currentQuestion);
      const nextIndex = (currentIndex + 1) % questions.length;
      updateCurrentQuestion(questions[nextIndex].text);
    }
  };

  const onStop = async () => {
    const matchedQuestion = questions.find(question => question.text === currentQuestion);
    stop()

    if (matchedQuestion) {
      const answerData = {
        id: uuidv4(),
        q_id: matchedQuestion.id,
        // score: /* calculate score if needed */,
        text: answer,
        user_id: userID,
        timestamp: Date.now(),
      };

      try {
        const response = await axios.post(`${apiServerUrl}/answers`, answerData);
      } catch (error) {
        console.error('Error posting answer:', error);
      }

      // Update currentQuestion
      updateCurrentQuestion(matchedQuestion);
    }
  };

  const handleClick = async () => {
    if (isRecording) {
      setIsRecording(false);
      await onStop();
      handleNext();
    } else {
      setIsRecording(true);
      onRecord();
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