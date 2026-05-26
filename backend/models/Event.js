const mongoose = require('mongoose');

// 1. Event Schema
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true }
}, { timestamps: true });

// 2. Volunteer Schema
const VolunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    skills: { type: String, required: true }
}, { timestamps: true });

// 3. Donation Schema
const DonationSchema = new mongoose.Schema({
    donorName: { type: String, required: true },
    amount: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
}, { timestamps: true });

// 4. Message Schema
const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
}, { timestamps: true });

module.exports = {
    Event: mongoose.model('Event', EventSchema),
    Volunteer: mongoose.model('Volunteer', VolunteerSchema),
    Donation: mongoose.model('Donation', DonationSchema),
    Message: mongoose.model('Message', MessageSchema)
};