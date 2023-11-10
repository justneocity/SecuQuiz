import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const QuizPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { selectedQuestions } = state;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [tagScores, setTagScores] = useState({});

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmitAnswer = () => {
    const isAnswerCorrect = selectedOption === currentQuestion.correctAnswer.toString();
    setIsCorrect(isAnswerCorrect);
    setSubmitted(true);

    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 1);
      currentQuestion.tags.forEach((tag) => {
        setTagScores((prevScores) => ({
          ...prevScores,
          [tag]: { ...(prevScores[tag] || { correct: 0, incorrect: 0 }), correct: (prevScores[tag]?.correct || 0) + 1 },
        }));
      });
    } else {
      currentQuestion.tags.forEach((tag) => {
        setTagScores((prevScores) => ({
          ...prevScores,
          [tag]: { ...(prevScores[tag] || { correct: 0, incorrect: 0 }), incorrect: (prevScores[tag]?.incorrect || 0) + 1 },
        }));
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === selectedQuestions.length - 1) {
      // navigate to the summary page
      navigate('/summary', { state: { score, tagScores, total: selectedQuestions.length } });
      return;
    }

    // Reset for next question
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);

    setCurrentQuestionIndex((prevIndex) => {
      return prevIndex < selectedQuestions.length - 1 ? prevIndex + 1 : prevIndex;
    });
  };

  // Check if questions are available
  if (!selectedQuestions || selectedQuestions.length === 0) {
    return <div>No questions to display. Please select questions first.</div>;
  }

  const feedbackTextStyle = isCorrect ? { color: 'green' } : { color: 'red' };

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h5" component="div">
            Question {currentQuestionIndex + 1}/{selectedQuestions.length}
          </Typography>
          <Typography variant="body2">
            {currentQuestion.question}
          </Typography>
          <RadioGroup name="options" value={selectedOption} onChange={handleOptionChange}>
            {currentQuestion.answers.map((answer, index) => (
              <FormControlLabel key={index} value={String(index)} control={<Radio />} label={answer} disabled={submitted} />
            ))}
          </RadioGroup>

          {submitted && (
            <Typography variant="body1" style={feedbackTextStyle}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
              {isCorrect ? '' : <div>Correct answer: {currentQuestion.answers[currentQuestion.correctAnswer]}</div>}
              <div>Explanation: {currentQuestion.explanation}</div>
            </Typography>
          )}
        </CardContent>
      </Card>
      <div>
        {!submitted
          ? (
          <Button variant="contained" onClick={handleSubmitAnswer} disabled={selectedOption === null}>
            Submit Answer
          </Button>
            )
          : (
          <Button variant="contained" onClick={handleNextQuestion}>
            Next Question
          </Button>
            )}
      </div>
    </div>
  );
};

export default QuizPage;
