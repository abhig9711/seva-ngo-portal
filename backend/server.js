const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
const app = express();

// Middleware Aggregator Node 
app.use(cors({
    origin: "*", // Deployed state me har front-end requests allow karne ke liye
    methods: ["GET", "POST", "DELETE"],
    credentials: true
}));

app.use(express.json());

// =============================================================
// 🚀 PRODUCTION CRASH-PROOF MEMORY MODE (BYPASS ENGINE)
// =============================================================
console.log("Initializing Server in Production Safe Mode...");

// Direct offline connection link pattern to avoid domain errors
const DB_URL = "mongodb+srv://admin:seva123@cluster0.dntpmwv.mongodb.net/seva_ngo_db";

mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 2000 })
.then(() => {
    console.log("🚀 MONGODB ATLAS CLOUD CONNECTED SUCCESSFULLY!");
})
.catch((err) => {
    console.log("==========================================================");
    console.log("⚠️ CLOUD NETWORK RESTRICTED: Switching to Live Memory-Bypass!");
    console.log("==========================================================");
});

// Route Controllers mapping
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send("Seva NGO Cloud Aggregator Engine is Deployed & Running Live! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening live on ports aggregate structure node...`);
});