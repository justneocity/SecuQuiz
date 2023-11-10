import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

const SummaryPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { score, tagScores, total } = state;

  // Calculate the tag with the most correct and incorrect answers
  let mostCorrectTag = null;
  let mostIncorrectTag = null;
  let maxCorrect = 0;
  let maxIncorrect = 0;
  Object.entries(tagScores).forEach(([tag, { correct, incorrect }]) => {
    if (correct > maxCorrect) {
      mostCorrectTag = tag;
      maxCorrect = correct;
    }
    if (incorrect > maxIncorrect) {
      mostIncorrectTag = tag;
      maxIncorrect = incorrect;
    }
  });

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Quiz Summary
      </Typography>
      <Typography variant="h6">
        You got {score} out of {total} questions correct.
      </Typography>
      <Typography variant="body1">
        Tag with most correct answers: {mostCorrectTag || 'None'}
      </Typography>
      <Typography variant="body1">
        Tag with most incorrect answers: {mostIncorrectTag || 'None'}
      </Typography>
      <Button onClick={handleBackToDashboard} variant="contained">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default SummaryPage;
