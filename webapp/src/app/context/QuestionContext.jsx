import React, { createContext, useContext, useState } from 'react';

const QuestionsContext = createContext();

const testData = [
  { id: "009f8c81-2099-42f1-bb11-1e73fbfe6e8c", text:	"How do you approach security testing and penetration testing for web applications?", cv_id:	"5795ef31-337d-4478-b764-c8e10a26c76b" },
  { id: "0d3460c6-eac2-4a74-a09c-32a802b1937c", text:	"What's your experience with Go?" }
]

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  // const [questions, setQuestions] = useState(testData);
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