import React, { useState } from 'react';
import { Button } from '@mui/material';

import './NewQuestionForm.css'

function NewQuestionModal ({ closeModal, submitNewQuestion, availableTags }) {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    questionType: 'text',
    tags: [],
    answerSelectionType: 'single',
    answers: ['', '', '', ''],
    correctAnswer: '0',
    messageForCorrectAnswer: '',
    messageForIncorrectAnswer: '',
    explanation: '',
    point: '0'
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  // Special handler for answers to handle an array of answers
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...newQuestion.answers];
    updatedAnswers[index] = value;
    setNewQuestion({ ...newQuestion, answers: updatedAnswers });
  };

  // Handle tag selection
  const handleTagChange = (tag) => {
    const updatedTags = newQuestion.tags.includes(tag)
      ? newQuestion.tags.filter((t) => t !== tag)
      : [...newQuestion.tags, tag];
    setNewQuestion({ ...newQuestion, tags: updatedTags });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitNewQuestion(newQuestion);
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
      <span className="close-button" onClick={closeModal}>&times;</span>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              name="question"
              value={newQuestion.question}
              onChange={handleChange}
              placeholder="Enter the question"
              required
            />
          </div>
          <div className='answers'>
            {newQuestion.answers.map((answer, index) => (
              <div className="form-group" key={`answer-${index}`}>
                <label>{`Answer ${index + 1}`}</label>
                <input
                  type="text"
                  name={`answer-${index}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                  required={index === 0}
                />
                <label>
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={index.toString()}
                    checked={newQuestion.correctAnswer === index.toString()}
                    onChange={handleChange}
                  />
                  Correct Answer
                </label>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Tags</label>
            <select multiple name="tags" value={newQuestion.tags} onChange={(e) => handleTagChange(e.target.value)}>
              {availableTags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Explanation</label>
            <textarea
              name="explanation"
              value={newQuestion.explanation}
              onChange={handleChange}
              placeholder="Enter an explanation for the correct answer"
              required
            />
          </div>
          <div className="form-group">
            <label>Message for Correct Answer</label>
            <input
              type="text"
              name="messageForCorrectAnswer"
              value={newQuestion.messageForCorrectAnswer}
              onChange={handleChange}
              placeholder="Enter the message for correct answer"
              required
            />
          </div>
          <div className="form-group">
            <label>Message for Incorrect Answer</label>
            <input
              type="text"
              name="messageForIncorrectAnswer"
              value={newQuestion.messageForIncorrectAnswer}
              onChange={handleChange}
              placeholder="Enter the message for incorrect answer"
              required
            />
          </div>
          <div className="form-group">
            <label>Point Value</label>
            <input
              type="number"
              name="point"
              value={newQuestion.point}
              onChange={handleChange}
              placeholder="Assign a point value for the question"
              required
            />
          </div>
          <Button type="submit" className="submit-btn">Submit Question</Button>
        </form>
      </div>
      <div className="modal-backdrop" onClick={closeModal} />
    </div>
  );
}

export default NewQuestionModal;
