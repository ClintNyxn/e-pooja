require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Booking = require('./models/Booking'); // Booking model

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'secretKey', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/e-pooja', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('E-Pooja Platform'));

// User registration route
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ username: req.body.username, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(400).send('Error registering user');
    }
});

// Booking route
app.post('/book', async (req, res) => {
    try {
        const newBooking = new Booking({
            userId: req.body.userId,
            date: req.body.date,
            poojaType: req.body.poojaType
        });
        await newBooking.save();
        res.status(201).send('Booking created successfully');
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(400).send('Error creating booking');
    }
});

// Route to get all bookings
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId', 'username');
        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(400).send('Error fetching bookings');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const path = require('path');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
