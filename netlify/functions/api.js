const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Import existing modules
const marketPricesService = require('../../modules/marketPrices');
const weatherService = require('../../modules/weatherService');
const farmingAdvisoryService = require('../../modules/farmingAdvisory');
const diseaseDiagnosisService = require('../../modules/diseaseDiagnosis');
const cropRecommendationsService = require('../../modules/cropRecommendations');
const User = require('../../models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'shambasmart-jwt-secret-key-2024';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Shambasmart API - Agricultural Assistant for Tanzanian Farmers' });
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, location, phone, farmSize, primaryCrops } = req.body;

    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = User.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone,
      farmSize,
      primaryCrops
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        role: user.role,
        farmSize: user.farmSize,
        primaryCrops: user.primaryCrops
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const user = User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location,
      role: user.role
    }
  });
});

// Market Prices Routes
app.get('/api/market/prices/:crop', authenticateToken, (req, res) => {
  try {
    const { crop } = req.params;
    const { language = 'en' } = req.query;
    
    const data = marketPricesService.getMarketPrices(crop, language);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Market prices error:', error);
    res.status(500).json({ message: 'Failed to fetch market prices' });
  }
});

app.get('/api/market/predictions/:crop', authenticateToken, (req, res) => {
  try {
    const { crop } = req.params;
    const { weeks = 4, language = 'en' } = req.query;
    
    const predictions = marketPricesService.predictPrices(crop, weeks, language);
    res.json({ success: true, data: predictions });
  } catch (error) {
    console.error('Price predictions error:', error);
    res.status(500).json({ message: 'Failed to fetch price predictions' });
  }
});

app.get('/api/market/comparison', authenticateToken, (req, res) => {
  try {
    const { language = 'en' } = req.query;
    
    const comparison = marketPricesService.compareMarkets(language);
    res.json({ success: true, data: comparison });
  } catch (error) {
    console.error('Market comparison error:', error);
    res.status(500).json({ message: 'Failed to fetch market comparison' });
  }
});

app.get('/api/market/insights', authenticateToken, (req, res) => {
  try {
    const { language = 'en' } = req.query;
    
    const insights = marketPricesService.getMarketInsights(language);
    res.json({ success: true, data: insights });
  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500).json({ message: 'Failed to fetch market insights' });
  }
});

// Weather Routes
app.get('/api/weather/:location', (req, res) => {
  try {
    const { location } = req.params;
    const { language = 'en' } = req.query;
    
    const weatherData = weatherService.getWeatherData(location, language);
    res.json(weatherData);
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

// Farming Advisory Routes
app.post('/api/advisory', authenticateToken, (req, res) => {
  try {
    const { crop, stage, location, issue, language = 'en' } = req.body;
    
    const advice = farmingAdvisoryService.getFarmingAdvice(crop, stage, location, issue, language);
    res.json(advice);
  } catch (error) {
    console.error('Farming advisory error:', error);
    res.status(500).json({ message: 'Failed to generate farming advice' });
  }
});

// Disease Diagnosis Routes
app.post('/api/diagnose', authenticateToken, upload.single('image'), (req, res) => {
  try {
    const { description, language = 'en' } = req.body;
    const image = req.file;
    
    const diagnosis = diseaseDiagnosisService.diagnoseDisease(description, image, language);
    res.json(diagnosis);
  } catch (error) {
    console.error('Disease diagnosis error:', error);
    res.status(500).json({ message: 'Failed to diagnose disease' });
  }
});

// Crop Recommendations Routes
app.post('/api/recommend-crops', authenticateToken, (req, res) => {
  try {
    const { location, soilType, season, goals, language = 'en' } = req.body;
    
    const recommendations = cropRecommendationsService.getCropRecommendations(
      location, soilType, season, goals, language
    );
    res.json(recommendations);
  } catch (error) {
    console.error('Crop recommendations error:', error);
    res.status(500).json({ message: 'Failed to generate crop recommendations' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large' });
    }
  }
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: 'Only image files are allowed' });
  }
  
  console.error('Server error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// Export for Netlify Functions
module.exports.handler = serverless(app);
