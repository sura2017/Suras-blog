// 1. Load environment variables
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const moment = require('moment'); // ✅ 1. Import Moment

const app = express();

// Import Routes
const blogsRoutes = require('./routes/blogsRoutes');
const authRoutes = require('./routes/authRoutes');
const { checkUser } = require('./controllers/authController');

// MongoDB connection
const dbURI = 'mongodb+srv://Sura:test1234@suracluster.c2lxnqg.mongodb.net/node-tuts?appName=SuraCluster';
mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('DB Connection Error:', err));

// Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'innex')); 

// ✅ 2. Make 'moment' available in ALL EJS views
app.locals.moment = moment; 

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(cookieParser()); 
app.use(morgan('dev'));

// Check User Status (Updates Navbar)
app.use(checkUser);

// Routes
// 1. HOME PAGE
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' }); 
});

// 2. ABOUT PAGE
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' }); 
});

// 3. AUTH ROUTES
app.use('/auth', authRoutes);

// 4. BLOG ROUTES
app.use('/blogs', blogsRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('none', { title: '404' });
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));