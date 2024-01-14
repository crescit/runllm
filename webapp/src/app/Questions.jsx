import React, { useState, useEffect } from 'react';
import { apiServerUrl } from './globals';
import { useQuestions } from './context/QuestionContext';

const Questions = ({ userID }) => {
  const { questions, updateQuestions, updateCurrentQuestion } = useQuestions();
  useEffect(() => {
    const split = apiServerUrl.split('/');
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  
    if (split.length >= 4 && split[3] === 'api') {
      split[2] += '/api';
    }
  
    const socket = new WebSocket(`${protocol}://${split[2]}/questions/${userID}`, 'echo-protocol');
  
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connected:', event);
    });
  
    socket.addEventListener('message', (event) => {
      const eventData = JSON.parse(event.data);
      const newArr = [...questions, ...eventData.Questions];
      updateQuestions(newArr);
      if (questions.length === 0) {
        updateCurrentQuestion(newArr[0].text);
      }
      console.log('WebSocket message received:', eventData);
    });
  
    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
      // Add your error handling logic here
    });
  
    socket.addEventListener('close', (event) => {
      console.log('WebSocket closed:', event);
      // Add your close handling logic here
    });
  
    return () => {
      socket.close();
    };
  }, [userID]);
  

  return (
    // <div>
    //   <h2>Questions</h2>
    //   <ul>
    //     {questions.map(question => (
    //       <li key={question.id}>{question.text}</li>
    //     ))}
    //   </ul>
    // </div>
    <>
    </>
  );
};

export default Questions;