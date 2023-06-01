const express = require('express');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const app = express();
app.use(express.json());
app.use(express.static('photos')); // Serve static files from the "photos" folder
const server = http.createServer(app)
const io = require('socket.io')(server);

// Stock data storage
let stockData = [];

// Connect to MongoDB
mongoose.connect('mongodb+srv://jhony-33:Serafim12@cluster0.v4dsgzx.mongodb.net/ReactApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

// Import the User model
//const User = require(`C:\\Users\\USER\\Desktop\\RestaurantApp\\DATABASE\\user`);

// Define User schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String
});

// Define Mission schema
const MissionSchema = new mongoose.Schema({
  role: String,
  mission: String,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  missionNumber: Number
});


// Define User model
const User = mongoose.model('users', UserSchema);
const Mission = mongoose.model('missions', MissionSchema);

// Define Mission Declaration schema
const MissionResultSchema = new mongoose.Schema({
  role: String,
  mission: String,
  done: { type: Boolean, default: false }, // Add a 'done' field to track mission completion
});

// Define the schema for the "orders" collection
const orderSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  itemName: { type: String, required: true },
  juiceName: { type: String },
  orderNumber: { type: Number, required: true },
  status: {type: Boolean, require: true},
});

// Define the stock schema
const stockSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  price: Number,
});

// Create a stock model
const Stock = mongoose.model('stocks', stockSchema);

// Middleware to parse JSON data
app.use(express.json());

// Define the "Order" model
const Order = mongoose.model('Order', orderSchema);

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
  
    try {
      // Find the user in the database
      const user = await User.findOne({ username });
  
      // If the user doesn't exist, return an error
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Compare the provided password with the stored password
      if (password === user.password) {
        //console.log("true");
        //console.log(user.role);
        return res.json({ role: user.role });
      }
      return res.status(401).json({ error: 'Invalid password' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

//missions endpoint
app.post('/AddMissions', async (req, res) => {
  const { role, mission } = req.body;
  try {
    // Fetch the number of existing missions
    const missionCount = await Mission.countDocuments();

    // Add mission to database with the assigned mission number
    const AddedJob = new Mission({ role, mission, missionNumber: missionCount + 1 });
    await AddedJob.save();

    // Send success response
    return res.status(201).json({ message: 'Mission is added successfully' });
  } catch (error) {
    console.error('Error uploading the mission', error);
    return res.status(500).json({ error: 'Failed to upload the mission' });
  }
});



//missions endpoint
app.get('/missions', async (req, res) => {
  try {
    // Fetch all missions from the database
    const missions = await Mission.find();

    // Send the missions as a response
    return res.status(200).json({ missions });
  } catch (error) {
    console.error('Error retrieving missions', error);
    return res.status(500).json({ error: 'Failed to retrieve missions' });
  }
});



// Signup endpoint
app.post('/AddUser', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
  
      // Create new user
      const newUser = new User({ username, email, password, role });
      await newUser.save();
  
      // Send success response
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error signing up user', error);
      return res.status(500).json({ error: 'Failed to sign up user' });
    }
  });
  


  // Create a new user route
app.post('/create-user', async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
  
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user instance
      const newUser = new User({
        username,
        password: hashedPassword,
        role,
      });
  
      // Save the user in the database
      await newUser.save();
  
      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Route to confirm mission as done
  app.post('/missions/:missionNumber/confirm', async (req, res) => {
    const missionNumber = req.params.missionNumber;
  
    try {
      // Find the mission in the database by its mission number
      const mission = await Mission.findOne({ missionNumber });
  
      // If the mission doesn't exist, return an error
      if (!mission) {
        return res.status(404).json({ error: 'Mission not found' });
      }
  
      // Toggle the mission status
      mission.status = mission.status === 'pending' ? 'completed' : 'pending';
      await mission.save();
  
      // Send success response
      return res.status(200).json({ message: 'Mission status updated' });
    } catch (error) {
      console.error('Error updating mission status:', error);
      return res.status(500).json({ error: 'Failed to update mission status' });
    }
  });
  
// Route to confirm mission as done
app.delete('/missions/:missionNumber/confirm', async (req, res) => {
  const missionNumber = req.params.missionNumber;

  try {
    // Find the mission in the database by its mission number
    const mission = await Mission.findOne({ missionNumber });

    // If the mission doesn't exist, return an error
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Delete the mission from the database
    await Mission.deleteOne({ missionNumber });

    // Send success response
    return res.status(200).json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    return res.status(500).json({ error: 'Failed to delete mission' });
  }
});

// DELETE /missions/:missionNumber
app.delete('/missions/:missionNumber', async (req, res) => {
  try {
    const { missionNumber } = req.params;

    // Check if the mission exists
    const mission = await Mission.findOne({ missionNumber });
    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Delete the mission from the database
    await Mission.deleteOne({ missionNumber });

    return res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    return res.status(500).json({ error: 'Failed to delete mission' });
  }
});

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


// Handle the POST request to create a new order
app.post('/orders', async (req, res) => {
  try {
    const { tableNumber, itemName, juiceName } = req.body;

    // Fetch the total number of orders
    const totalOrders = await Order.countDocuments();

    // Create a new order instance with orderNumber
    const order = new Order({
      tableNumber,
      itemName,
      juiceName,
      orderNumber: totalOrders + 1, // Increment the totalOrders to get the next order number
      status: false, // Set the initial status as "unready"
    });

    // Save the order to the "orders" collection
    await order.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error creating order:', error);
    res.sendStatus(500);
  }
});



// Handle the GET request to retrieve all orders
app.get('/orders', async (req, res) => {
  try {
    // Retrieve all orders from the "orders" collection
    const orders = await Order.find();

    res.json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.sendStatus(500);
  }
});


// Handle the PUT request to update the status of an order
app.put('/orders/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update the status of the order to true
    order.status = true;
    await order.save();

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.sendStatus(500);
  }
});

// Route to add stock
app.post('/AddStock', async (req, res) => {
  const { productName, quantity, price } = req.body;
  console.log(productName);

  // Validate input
  if (!productName || !quantity || !price) {
    return res.status(400).json({ error: 'Incomplete stock data' });
  }

  try {
    // Create a new stock object
    const newStock = new Stock({
      productName,
      quantity,
      price,
    });

    // Save the stock to the database
    await newStock.save();

    // Emit the updated stock data to all connected clients
    io.emit('stockUpdate', { stock: newStock });

    // Return a success response
    res.status(200).json({ message: 'Stock added successfully' });
  } catch (error) {
    console.error('Failed to save stock:', error);
    res.status(500).json({ error: 'Failed to save stock' });
  }
});

// Define a route to fetch and display stock data
app.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Endpoint to check product availability
app.post('/stock', async (req, res) => {
  const { juiceName } = req.body;

  try {
    // Query MongoDB to check product availability
    const stock = await Stock.findOne({ productName: juiceName });
    const available = stock ? true : false;
    res.json({ available });
  } catch (error) {
    console.error('Error checking product availability:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete order by order number
app.delete('/delorders', async (req, res) => {
  const orderNumber = req.query.orderNumber;

  try {
    const result = await Order.deleteOne({ orderNumber });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(200).json({ message: 'Order deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});