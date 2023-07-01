const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(express.static('photos')); // Serve static files from the "photos" folder
const server = http.createServer(app)
const io = require('socket.io')(server);
const cookieSession = require('cookie-session');

// Stock data storage
let stockData = [];

// Create a proxy middleware for "/checkLoginStatus" endpoint
const checkLoginStatusProxy = createProxyMiddleware({
  target: 'https://nourapp.onrender.com',
  changeOrigin: true,
});

// Set up the proxy middleware
app.use('/checkLoginStatus', checkLoginStatusProxy);

app.get('/menu', (req, res) => {
  const menu = [
    { 
      name: 'Burger',
      price: '$10',
      photo: 'burger.jpeg',
      description: 'A juicy beef patty topped with cheese, lettuce, and tomatoes. Served with fries.',
    },
    { 
      name: 'Pizza',
      price: '$12',
      photo: 'pizza.jpeg',
      description: 'A classic combination of marinara sauce, cheese, and assorted toppings on a thin crust.',
    },
    { 
      name: 'Salad',
      price: '$8',
      photo: 'salad.jpeg',
      description: 'Fresh mixed greens, cherry tomatoes, cucumber, and feta cheese. Served with a tangy vinaigrette.',
    },
    { 
      name: 'Pasta',
      price: '$14',
      photo: 'pasta.jpeg',
      description: 'Al dente pasta tossed in a rich tomato sauce, sprinkled with Parmesan cheese and fresh basil.',
    },
    { 
      name: 'Sushi',
      price: '$16',
      photo: 'sushi.jpeg',
      description: 'Assorted sushi rolls with fresh fish, avocado, and cucumber. Served with soy sauce and wasabi.',
    },
  ];
  
  res.json(menu);
});

app.get('/checkLoginStatus', (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.json({ username: '' });
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://jhony-33:Serafim12@cluster0.v4dsgzx.mongodb.net/ReactApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});