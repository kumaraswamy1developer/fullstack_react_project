const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


const secretKey = 'secret';
let users = [];

// Function to create JWT token
const createToken = (username) =>
    jwt.sign({ username }, secretKey, { expiresIn: "1h" });

// Endpoint to register a new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Endpoint to create a hashed password
app.post('/api/hash-password', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    res.json({ hashedPassword });
  } catch (err) {
    console.error('Hashing error:', err);
    res.status(500).json({ message: 'Error hashing password' });
  }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    console.log('Received Content-Type:', req.headers['content-type']);
    console.log('Received body:', req.body);
  
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
  
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = createToken(username);
      return res.json({ token });
    }
  
    res.status(401).json({ message: 'Invalid credentials' });
  });
  
// Middleware to verify token
const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ message: "User not logged in" });
  
    // Extract token after "Bearer "
    const token = authHeader.split(" ")[1];
  
    if (!token) return res.status(403).json({ message: "Token missing" });
  
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Save decoded user info for later
      next();
    } catch (err) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
  

// Dashboard endpoint
app.get("/api/dashboard", authenticate, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}`, cards: [1, 2, 3] });
  });
  
  
// Map endpoint
app.get("/api/map", authenticate, (req, res) => {
    res.json({
      message: `Hi ${req.user.username}, here’s the map!`,
      location: { lat: 20.5937, lng: 78.9629, zoom: 5 },
    });
  });
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
  });
  
app.listen(port, () => console.log(`Server running on port ${port}`));

