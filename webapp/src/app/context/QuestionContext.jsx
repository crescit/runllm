import React, { createContext, useContext, useState } from 'react';

const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const updateQuestions = (newQuestions) => {
    setQuestions(newQuestions);
  };

  const updateCurrentQuestion = (newCurrentQuestion) => {
    setCurrentQuestion(newCurrentQuestion);
  };

  return (
    <QuestionsContext.Provider value={{ questions, currentQuestion, updateQuestions, updateCurrentQuestion }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  return useContext(QuestionsContext);
};