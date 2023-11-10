import React, { useState } from 'react';

function EditQuestionModal ({ question, closeModal, updateQuestion, deleteQuestion }) {
  // State for the question form
  const [questionForm, setQuestionForm] = useState(question);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm({ ...questionForm, [name]: value });
  };

  // Handle form submission for updating
  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateQuestion(questionForm);
    closeModal();
  };

  // Handle question deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(question.id);
      closeModal();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <h3>Edit Question</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="question">Question</label>
          <input
            id="question"
            type="text"
            name="question"
            value={questionForm.question}
            onChange={handleChange}
            required
          />
          {/* Add other form inputs for question details here */}
          <button type="submit">Update Question</button>
        </form>
        <button onClick={handleDelete} className="delete-button">
          Delete Question
        </button>
      </div>
    </div>
  );
}

export default EditQuestionModal;
