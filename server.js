const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// RestDB Configuration
const RESTDB_URL = 'https://mokesell-2d85.restdb.io/rest/users';
const RESTDB_API_KEY = '80624ddb6222e495518b2236f2a0413e50465';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Input validation middleware
const validateSignupInput = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Username validation
    if (username.length < 3 || username.length > 20) {
        return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password validation
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    next();
};

// Check if username exists
async function checkUsernameExists(username) {
    try {
        const response = await fetch(`${RESTDB_URL}?q={"username":"${username}"}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_API_KEY
            }
        });
        const data = await response.json();
        return data.length > 0;
    } catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
}

// Check if email exists
async function checkEmailExists(email) {
    try {
        const response = await fetch(`${RESTDB_URL}?q={"email":"${email}"}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_API_KEY
            }
        });
        const data = await response.json();
        return data.length > 0;
    } catch (error) {
        console.error('Error checking email:', error);
        throw error;
    }
}

// Signup endpoint
app.post('/api/signup', validateSignupInput, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email already exists
        const [usernameExists, emailExists] = await Promise.all([
            checkUsernameExists(username),
            checkEmailExists(email)
        ]);

        if (usernameExists) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        if (emailExists) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user in RestDB
        const response = await fetch(RESTDB_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': RESTDB_API_KEY
            },
            body: JSON.stringify({
                username,
                email,
                password, // In production, hash this password
                coins: 1250,
                createdAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create user in database');
        }

        const newUser = await response.json();
        
        // Remove password from response
        delete newUser.password;
        
        res.status(201).json({
            message: 'Account created successfully',
            user: newUser
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});