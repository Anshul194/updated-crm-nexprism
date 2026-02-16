const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    visitor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true, index: true },
    session_unique_id: { type: String, required: true, unique: true }, // UUID for this specific session

    start_time: { type: Date, default: Date.now, index: true },
    end_time: { type: Date },
    duration: { type: Number, default: 0 }, // seconds

    // Traffic Source
    referrer_url: String,
    landing_page: String,
    exit_page: String,
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_term: String,

    // Tech
    device_type: String,
    browser: String,
    os: String,
    screen_resolution: String,

    page_views: { type: Number, default: 0 },
    events_count: { type: Number, default: 0 },

    is_bounce: { type: Boolean, default: true } // False if >1 page view or >30s duration
}, { timestamps: true });

module.exports = mongoose.model('VisitSession', sessionSchema);
