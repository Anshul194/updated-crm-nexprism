const mongoose = require('mongoose');

const trackingEventSchema = new mongoose.Schema({
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'VisitSession', required: true, index: true },
    visitor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true, index: true },

    type: {
        type: String,
        enum: ['pageview', 'click', 'scroll', 'form_submit', 'custom', 'conversion'],
        required: true
    },

    url: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, index: true },

    // Event specific data
    event_name: String, // e.g. "Pricing Button Click"
    element_id: String,
    element_class: String,
    element_text: String,
    x: Number,
    y: Number,
    viewport_width: Number,
    viewport_height: Number,
    selector: String,

    scroll_percentage: Number,

    form_id: String,
    form_data: mongoose.Schema.Types.Mixed, // Be careful with sensitive data

    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('TrackingEvent', trackingEventSchema);
