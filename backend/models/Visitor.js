const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    visitor_unique_id: { type: String, required: true, unique: true, index: true }, // UUID from client cookie/storage
    identified_contact_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }, // Link to CRM Contact if identified (e.g. form submit)
    identified_email: { type: String, index: true },
    identified_name: { type: String },

    first_seen: { type: Date, default: Date.now },
    last_seen: { type: Date, default: Date.now },

    total_visits: { type: Number, default: 0 },
    total_time_spent: { type: Number, default: 0 }, // in seconds
    lead_score: { type: Number, default: 0 },

    // Demographics (from IP/UserAgent of last session)
    ip_address: String,
    location: {
        country: String,
        city: String,
        region: String
    },
    device_type: String, // mobile, desktop, tablet
    os: String,
    browser: String,

    tags: [String] // e.g. "Hot Lead", "Returning"
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
