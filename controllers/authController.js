const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load secret from .env

// 1. Define Token Settings
const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

// ⚠️ Get Secret from .env (Security Best Practice)
const secret = process.env.JWT_SECRET; 
if (!secret) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    // We don't exit process here to prevent crashing dev server repeatedly, 
    // but auth will fail if this is missing.
}

// 2. Error Handling Helper Function
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errorMessage = 'An error occurred';

    // Duplicate Email Error (Mongo code 11000)
    if (err.code === 11000) {
        return 'That email is already registered';
    }

    // Validation Errors (e.g., password too short)
    if (err.message.includes('User validation failed')) {
        // Loop through errors and take the first one
        Object.values(err.errors).forEach(({ properties }) => {
            errorMessage = properties.message;
        });
        return errorMessage;
    }

    return errorMessage;
};

// -----------------------------------------------------------
// CONTROLLERS
// -----------------------------------------------------------

// ✅ SIGN UP
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Create user (Mongoose handles validation automatically)
        const user = new User({ email, password });
        await user.save();
        
        // Success: Redirect to login page
        // Note: Your frontend script intercepts this and follows the redirect
        res.redirect('/auth/login');
    } catch (err) {
        const message = handleErrors(err);
        // Send error as text so frontend script can display it in red
        res.status(400).send(message);
    }
};

// ✅ LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (!user || !(await user.comparePassword(password))) {
             return res.status(400).send('Invalid email or password');
        }

        // Create JWT Token
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: maxAge });

        // Send Cookie
        res.cookie('jwt', token, { 
            httpOnly: true, 
            maxAge: maxAge * 1000,
            // Secure only in production (requires HTTPS)
            secure: process.env.NODE_ENV === 'production' 
        });

        res.redirect('/blogs');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// ✅ LOGOUT
exports.logout = (req, res) => {
    // Replace JWT with a blank cookie that expires in 1ms
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

// -----------------------------------------------------------
// MIDDLEWARE
// -----------------------------------------------------------

// ✅ VERIFY TOKEN (Protects Routes like /create and /delete)
exports.verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    // If no token, force login
    if (!token) return res.redirect('/auth/login');

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.redirect('/auth/login');
        }
        req.userId = decoded.id;
        next();
    });
};

// ✅ CHECK USER (For UI/Navbar - Runs on every page)
exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                try {
                    let user = await User.findById(decoded.id);
                    res.locals.user = user; // Makes 'user' available in EJS
                    next();
                } catch (error) {
                    res.locals.user = null;
                    next();
                }
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};