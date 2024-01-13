import React from 'react';
import { useQuestions } from './context/QuestionContext';

const PrevButton = () => {
    const { questions, currentQuestion, updateCurrentQuestion } = useQuestions();
  
    const handlePrevious = () => {
      if (questions.length > 0) {
        const currentIndex = questions.findIndex(question => question.text === currentQuestion);
        const previousIndex = (currentIndex - 1) % questions.length;
        updateCurrentQuestion(questions[previousIndex].text);
      }
    };
  
    return (
      <button
        className={`button play-button `}
        onClick={handlePrevious}>
        Previous Question
      </button>
    )
}

export default PrevButton