// models/Booking.js

const mongoose = require('mongoose');

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    poojaType: { type: String, required: true }
});

// Export the Booking model
module.exports = mongoose.model('Booking', bookingSchema);
