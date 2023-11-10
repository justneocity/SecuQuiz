import React, { useState, useEffect, useContext } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import { AuthContext } from '../AuthContext';
import NewQuestionModal from '../components/NewQuestionModal';
import EditQuestionModal from '../components/EditQuestionModal'

import './Dashboard.css';

function Dashboard () {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = React.useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [allTags, setAllTags] = React.useState([]);
  const [selectedTags, setSelectedTags] = React.useState([]);

  const [searchTerm, setSearchTerm] = useState('')

  const [modalOpen, setModalOpen] = useState(false);

  const [showMyQuestions, setShowMyQuestions] = useState(false);

  const updateQuestion = async (updatedQuestionData) => {
    try {
      const response = await fetch(`http://localhost:5005/questions/${updatedQuestionData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuestionData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Question updated successfully:', data);
  
      // Update local state to reflect the updated question
      setAllQuestions(allQuestions =>
        allQuestions.map(question => question.id === data.id ? data : question)
      );
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      const response = await fetch(`http://localhost:5005/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Question deleted successfully:', data);
  
      setAllQuestions(allQuestions =>
        allQuestions.filter(question => question.id !== questionId)
      );
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };  
  
  // toggle the display of user's questions
  const toggleShowMyQuestions = async () => {
    const currentlyShowingUserQuestions = showMyQuestions;
    setShowMyQuestions(!currentlyShowingUserQuestions);

    if (currentlyShowingUserQuestions) {
      // If currently showing user questions, switch back to showing all questions
      setSelectedQuestions(allQuestions); // Reset to all questions
      setSelectedTags(allTags); // Reset to all tags
      setSearchTerm(''); // Clear the search term
    } else {
      // If currently showing all questions, fetch and display user's questions
      await fetchUserQuestions();
    }
  };

  // Function to fetch user-specific questions
  const fetchUserQuestions = async () => {
    const email = localStorage.getItem('userEmail');
    try {  
      const response = await fetch('http://localhost:5005/user/questions', {
        headers: {
          email: email
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user questions');
      }

      const userQuestions = await response.json();
      setSelectedQuestions(userQuestions);
      console.log(userQuestions)
    } catch (error) {
      console.error('Error fetching user questions:', error);
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [modalOpen]);

  const openModal = () => {
    if (isAuthenticated) {
      setModalOpen(true);
    } else {
      alert('Please log in to create a question.');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const submitNewQuestion = async (newQuestionData) => {
    try {
      const response = await fetch('http://localhost:5005/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestionData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit question');
      }
  
      const addedQuestion = await response.json();
      console.log(addedQuestion);
      setAllQuestions(prevQuestions => [...prevQuestions, addedQuestion.newQuestion]);
      setSelectedQuestions(prevQuestions => [...prevQuestions, addedQuestion.newQuestion]);
      setModalOpen(false);

      // Add the question ID to the user's list of created question IDs
      updateUserCreatedQuestions(addedQuestion.newQuestion.id);
    } catch (error) {
      console.error('Error submitting new question:', error);
    }
  };

  const updateUserCreatedQuestions = async (questionId) => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch(`http://localhost:5005/users/${email}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user created questions');
      }

      const updatedUser = await response.json();
      console.log('Updated user created questions', updatedUser);
    } catch (error) {
      console.error('Error updating user created questions:', error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5005/questions'); // Adjust the URL if your backend is hosted elsewhere
        const data = await response.json();
        setAllQuestions(data);
        setSelectedQuestions(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching the questions:', error);
      }
    }

    const fetchTags = async () => {
      try {
        const response = await fetch('http://localhost:5005/tags');
        const data = await response.json();
        setAllTags(data);
        setSelectedTags(data);
      } catch (error) {
        console.error('Error fetching the tags:', error);
      }
    }

    fetchQuestions();
    fetchTags();
  }, []);

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleResetClick = () => {
    setSelectedQuestions(allQuestions);
    setSelectedTags(allTags);
    setSearchTerm('');
  };

  const handleStartQuiz = () => {
    navigate('/quiz', { state: { selectedQuestions } });
  };

  const selectTaggedQuestions = (tags) => {
    const questionsToAdd = [];
    // loop through all questions and filter out ones that match the tag
    for (const q of allQuestions) {
      if (tags.some(tag => q.tags.includes(tag))) {
        questionsToAdd.push(q);
      }
    }
    return questionsToAdd;
  }

  const searchQuestions = (newSelectedQuestions, searchTerm) => {
    const questionsToAdd = [];
    searchTerm = searchTerm.toLowerCase();
    // loop through the filtered questions and filter out ones that match the subject name
    for (const q of newSelectedQuestions) {
      if (q.question.toLowerCase().includes(searchTerm)) {
        questionsToAdd.push(q);
      }
    }
    return questionsToAdd;
  };

  // Effect to refilter questions when tags or searchTerm change
  React.useEffect(() => {
    let newSelectedQuestions = selectTaggedQuestions(selectedTags);
    if (searchTerm) {
      newSelectedQuestions = searchQuestions(newSelectedQuestions, searchTerm);
    }
    setSelectedQuestions(newSelectedQuestions);
  }, [selectedTags, searchTerm]);

  return (
    <div>
      {modalOpen && (
        <div className="modal-overlay">
          <NewQuestionModal
            className="modal-content" 
            closeModal={closeModal}
            submitNewQuestion={submitNewQuestion}
            availableTags={allTags}
          />
        </div>
      )}
      <div className='filtersContainer'>
        {/* tag selector box */}
        <div className='tagContainer'>
          {allTags.map(tag => (
            <Button variant="outlined"
              key={tag}
              onClick={() => handleTagClick(tag)}
              style={{ backgroundColor: selectedTags.includes(tag) ? 'lightblue' : 'transparent' }}
            >
              {tag}
            </Button>
          ))}
        </div>
        <button
          onClick={handleResetClick}
          className="button-hover-effect"
        >
          Reset Filters
        </button>
      </div>
      {/* search box */}
      <div className='searchBox'>
        <search noValidate
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        >
          <TextField
            label="Search for questions"
            fullWidth
            style={{ height: 50, width: '100%', position: 'relative' }}
          ></TextField>
        </search>
      </div>
      <div className='startGameContainer'>
        <div>
          {isAuthenticated && (
          <Button
            variant="outlined"
            onClick={toggleShowMyQuestions}
            style={{ backgroundColor: 'transparent' }}
          >
            {showMyQuestions ? 'Show All Questions' : 'My Questions'}
          </Button>
          )}
          {isAuthenticated && (
            <Button variant="outlined" onClick={openModal} style={{ margin: '10px' }}>
              Create New Question
            </Button>
          )}
        </div>
        <div>
          {selectedQuestions.length} questions selected
        </div>
        <Button variant="outlined"
            onClick={handleStartQuiz}
            style={{ backgroundColor: 'transparent' }}
            >
            Start Quiz
        </Button>
      </div>

      {/* question box */}
      <Grid container spacing={5} className='questionContainer'>
          { selectedQuestions.map((question) => (
            <Grid item key={question.id} xs={12} sm={6} md={3} lg={3} xl={3}>
              <QuestionCard 
                question={question}
                editQuestionModal={EditQuestionModal}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  )
}

export default Dashboard;
