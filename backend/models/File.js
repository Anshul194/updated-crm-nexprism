const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String }, // Mime type or extension
    size: { type: Number },
    url: { type: String }, // Could be path or external URL
    projectId: { type: String },
    clientId: { type: String },
    uploadedBy: { type: String }, // User ID
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
