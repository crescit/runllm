import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiServerUrl } from './globals';

const Questions = ({ userID }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const split = apiServerUrl.split('/');
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${protocol}://${split[2]}/questions/${userID}`, 'echo-protocol');
  
    // Connection opened
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connected:', event);
    });
  
    // Listen for messages
    socket.addEventListener('message', (event) => {
      const eventData = JSON.parse(event.data);
  
      // Handle WebSocket messages
      console.log('WebSocket message received:', eventData);
    });
  
    // Connection closed
    socket.addEventListener('close', (event) => {
      console.log('WebSocket closed:', event);
    });
  
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, [ userID]);

  return (
    <div>
      <h2>Questions</h2>
      <ul>
        {questions.map(question => (
          <li key={question.id}>{question.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;