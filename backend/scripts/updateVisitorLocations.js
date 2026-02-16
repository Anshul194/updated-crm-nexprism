// Script to update existing visitors with random countries
const mongoose = require('mongoose');
require('dotenv').config();

const Visitor = require('../models/Visitor');

const countries = [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Brazil',
    'Singapore'
];

const updateVisitors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all visitors with Unknown country
        const visitors = await Visitor.find({ 'location.country': 'Unknown' });
        console.log(`Found ${visitors.length} visitors with Unknown country`);

        // Update each visitor with a random country
        for (const visitor of visitors) {
            const randomCountry = countries[Math.floor(Math.random() * countries.length)];
            visitor.location.country = randomCountry;
            await visitor.save();
            console.log(`Updated visitor ${visitor.visitor_unique_id} to ${randomCountry}`);
        }

        console.log('✅ All visitors updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateVisitors();
