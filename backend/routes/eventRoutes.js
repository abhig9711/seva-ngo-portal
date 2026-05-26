const express = require('express');
const router = express.Router();
const { Event, Volunteer, Donation, Message } = require('../models/Event');

// --- 1. EVENTS CRUD ---
router.get('/all', async (req, res) => {
    try { const data = await Event.find({}).sort({ createdAt: -1 }); return res.status(200).json(data); } catch (e) { return res.status(200).json([]); }
});
router.post('/add', async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const newE = new Event({ title, description, date, location });
        await newE.save();
        return res.status(200).json({ message: "Campaign Node Live!", event: newE });
    } catch(e){ return res.status(500).json({ error: e.message }); }
});

// --- 2. VOLUNTEERS CRUD ---
router.get('/volunteers/all', async (req, res) => {
    try { const data = await Volunteer.find({}).sort({ createdAt: -1 }); return res.status(200).json(data); } catch(e) { return res.status(200).json([]); }
});
router.post('/volunteers/add', async (req, res) => {
    try {
        const { name, email, phone, skills } = req.body;
        const newV = new Volunteer({ name, email, phone, skills });
        await newV.save();
        return res.status(200).json({ message: "Roster Enrolled Successfully!", volunteer: newV });
    } catch(e){ return res.status(500).json({ error: e.message }); }
});

// --- 3. DONATIONS CRUD ---
router.get('/donations/all', async (req, res) => {
    try { const data = await Donation.find({}).sort({ createdAt: -1 }); return res.status(200).json(data); } catch(e) { return res.status(200).json([]); }
});
router.post('/donations/add', async (req, res) => {
    try {
        const { donorName, amount, paymentMethod } = req.body;
        const newD = new Donation({ donorName, amount, paymentMethod });
        await newD.save();
        return res.status(200).json({ message: "Remittance Settled! Dil se Dhanyawad.", donation: newD });
    } catch(e){ return res.status(500).json({ error: e.message }); }
});

// --- 4. MESSAGES / INBOX CRUD ---
router.get('/messages/all', async (req, res) => {
    try { const data = await Message.find({}).sort({ createdAt: -1 }); return res.status(200).json(data); } catch(e) { return res.status(200).json([]); }
});
router.post('/messages/add', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const newM = new Message({ name, email, subject, message });
        await newM.save();
        return res.status(200).json({ message: "Message sent successfully!" });
    } catch(e){ return res.status(500).json({ error: e.message }); }
});
router.delete('/messages/delete/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Query Resolved & Purged From Database!" });
    } catch(e){ return res.status(500).json({ error: e.message }); }
});

module.exports = router;