// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data
app.use(express.static('public')); // Serve static files

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory data storage (in real apps, use a database)
let users = [];
let messages = [];

// Routes

// Home page - displays form and data
app.get('/', (req, res) => {
  res.render('index', { 
    users: users,
    messages: messages,
    title: 'Server-Side Rendering Demo'
  });
});

// Handle user registration form submission
app.post('/register', (req, res) => {
  const { username, email, age } = req.body;
  
  // Basic validation
  if (!username || !email) {
    return res.render('index', {
      users: users,
      messages: messages,
      title: 'Server-Side Rendering Demo',
      error: 'Username and email are required!'
    });
  }

  // Add user to array
  const newUser = {
    id: users.length + 1,
    username,
    email,
    age: age || 'Not specified',
    registeredAt: new Date().toLocaleString()
  };
  
  users.push(newUser);
  
  // Redirect to home page (Post-Redirect-Get pattern)
  res.redirect('/');
});

// Handle message form submission
app.post('/message', (req, res) => {
  const { message, author } = req.body;
  
  if (!message || !author) {
    return res.render('index', {
      users: users,
      messages: messages,
      title: 'Server-Side Rendering Demo',
      error: 'Message and author are required!'
    });
  }

  const newMessage = {
    id: messages.length + 1,
    author,
    message,
    timestamp: new Date().toLocaleString()
  };
  
  messages.push(newMessage);
  res.redirect('/');
});

// API endpoint to get users as JSON
app.get('/api/users', (req, res) => {
  res.json({ success: true, users: users });
});

// API endpoint to get messages as JSON
app.get('/api/messages', (req, res) => {
  res.json({ success: true, messages: messages });
});

// Delete user endpoint
app.post('/delete-user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(user => user.id !== userId);
  res.redirect('/');
});

// Clear all data endpoint
app.post('/clear', (req, res) => {
  users = [];
  messages = [];
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});