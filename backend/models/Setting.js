const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    type: { type: String, default: 'general', unique: true },
    companyProfile: {
        name: { type: String, default: 'Nexprism Agency' },
        logo: String,
        icon: String,
        themeColor: { type: String, default: '#0f172a' }, // Default slate-900
        logoWidth: { type: String, default: 'auto' },
        logoHeight: { type: String, default: '32px' },
        website: String,
        address: String,
        phone: String,
        email: String,
        gst: String,
        pan: String,
        currency: { type: String, default: 'INR' },
        timezone: { type: String, default: 'Asia/Kolkata' },
        businessHours: String
    },
    billing: {
        razorpayKey: String,
        razorpaySecret: String,
        invoiceFormat: { type: String, default: 'INV-2026-001' },
        taxRate: { type: Number, default: 18 },
        paymentTerms: { type: String, default: '15' },
        lateFee: Number
    },
    notifications: {
        emailAlerts: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
        taskAssignments: { type: Boolean, default: true }
    },
    emailSettings: {
        host: String,
        port: { type: Number, default: 587 },
        user: String,
        pass: String,
        fromEmail: String,
        fromName: String,
        secure: { type: Boolean, default: false }
    },
    roles: [{
        name: { type: String, required: true }, // e.g. 'admin'
        label: { type: String }, // e.g. 'Administrator'
        permissions: { type: Object, default: {} }
    }],
    dashboardLayouts: {
        type: Map,
        of: [String],
        default: {
            'owner': ['financials', 'operational', 'analytics', 'funnel', 'deadlines', 'activity', 'leads'],
            'admin': ['financials', 'operational', 'analytics', 'funnel', 'deadlines', 'activity', 'leads'],
            'pm': ['operational', 'deadlines', 'activity'],
            'employee': ['operational', 'deadlines']
        }
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Setting', settingSchema);
