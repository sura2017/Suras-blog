const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ------------------------------------
// SIGN UP
// ------------------------------------
// GET: Show the Sign Up HTML Form
router.get('/signup', (req, res) => {
    res.render('signup'); // Looks for innex/signup.ejs
});

// POST: Handle the form submission (Save user to DB)
router.post('/signup', authController.signup);


// ------------------------------------
// LOGIN
// ------------------------------------
// GET: Show the Login HTML Form
router.get('/login', (req, res) => {
    res.render('login'); // Looks for innex/login.ejs
});

// POST: Handle the form submission (Check password & create token)
router.post('/login', authController.login);


// ------------------------------------
// LOGOUT
// ------------------------------------
// GET: Delete cookie and redirect
router.get('/logout', authController.logout);


module.exports = router;