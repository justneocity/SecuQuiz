import fs from 'fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

import { InputError, AccessError, } from './error';
import swaggerDocument from '../swagger.json';

const app = express();
app.use(cors());
app.use(bodyParser.json());
// const data = require('./database.json'); 
const data = JSON.parse(fs.readFileSync('./database.json'));

// Signup route
app.post('/signup', bodyParser.json(), (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if email already exists
  const userExists = data.users.some(user => user.email === email);
  
  if (userExists) {
    return res.status(409).json({ message: 'Email already exists' }); // 409 Conflict
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
  
  // Add new user to the users array
  const newUser = { name, email, password: hashedPassword, createdQuestions: [] };
  data.users.push(newUser);
  
  res.status(201).json({ message: 'User created successfully' });
});

// Login route
app.post('/login', bodyParser.json(), (req, res) => {
  const { email, password } = req.body;

  // check password matches and email exists
  const userExists = data.users.some(user => user.email === email && user.password === password);
  if (userExists) {
    // Authenticate the user...
    res.status(200).json({ message: 'User logged in successfully' });
  }
  res.status(409).json({message: 'Email or password is incorrect'});
  
});

app.get('/questions', (req, res) => {
  res.json(data.questions);
});

// Route for retrieving the list of tags
app.get('/tags', (req, res) => {
  res.json(data.tags);
});

app.post('/questions', (req, res) => {
  console.log(req.body);
  const newQuestion = req.body;

  // Basic validation check
  if (!newQuestion.question || !newQuestion.answers || !newQuestion.answers.length) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  // Set the id of the new question to the id of the last question + 1
  const lastQuestionId = data.questions.length ? data.questions[data.questions.length - 1].id : 0;
  newQuestion.id = lastQuestionId + 1;

  // Add the new question to the data
  data.questions.push(newQuestion);

  // Save to database.json asynchronously and handle possible errors
  fs.writeFile('./database.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Failed to save the new question to the database:', err);
      return res.status(500).json({ error: 'Failed to save the new question' });
    }

    // Respond with the new question object, now including its ID
    res.json({ success: true, newQuestion: newQuestion });
  });
});

// Get user-specific questions
app.get('/user/questions', async (req, res) => {
  // Extract email from token (assuming you have a method for this)
  const email = req.headers.email;
  console.log(email);

  // Find user by email
  const user = data.users.find(user => user.email === email);

  // If user not found, return an error
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Filter questions created by the user
  const userQuestions = data.questions.filter(question =>
    user.createdQuestions.includes(question.id)
  );

  // Return the user's questions
  res.json(userQuestions);
});

app.put('/questions/:id', (req, res) => {
  const { id } = req.params;
  const updatedQuestion = req.body;

  // Find the index of the question with the given ID
  const questionIndex = data.questions.findIndex(q => q.id === parseInt(id, 10));
  if (questionIndex === -1) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Update the question at the found index
  data.questions[questionIndex] = { ...data.questions[questionIndex], ...updatedQuestion };

  // Save the updated questions array back to the database
  fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));

  // Respond with the updated question
  res.json(data.questions[questionIndex]);
});

app.delete('/questions/:id', (req, res) => {
  const { id } = req.params;

  // Filter out the question with the given ID
  data.questions = data.questions.filter(q => q.id !== parseInt(id, 10));

  // Save the updated questions array back to the database
  fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));

  // Respond with a success message
  res.json({ message: 'Question deleted successfully' });
});

// Endpoint to add a question ID to the user's list of created questions
app.post('/users/:email/questions', (req, res) => {
  const { email } = req.params; // Get the email from the URL parameter
  const { questionId } = req.body; // Get the question ID from the request body

  // Find the user by email
  const userIndex = data.users.findIndex(user => user.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Add the question ID to the user's createdQuestions array
  if (!data.users[userIndex].createdQuestions.includes(questionId)) {
    data.users[userIndex].createdQuestions.push(questionId);
  }

  // Save the updated data to 'database.json'
  fs.writeFile('./database.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Failed to update user profile:', err);
      return res.status(500).json({ error: 'Failed to update user profile' });
    }

    // Respond with the updated user profile
    res.json({ success: true, user: data.users[userIndex] });
  });
});


/***************************************************************
                       Running Server
***************************************************************/

app.get('/', (req, res) => res.redirect('/docs'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configData = JSON.parse(fs.readFileSync('../frontend/src/config.json'));
const port = 'BACKEND_PORT' in configData ? configData.BACKEND_PORT : 5000;

const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
});

export default server;
