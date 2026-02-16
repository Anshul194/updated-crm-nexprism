const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatWidgetSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    widget_name: { type: String, required: true },
    widget_token: { type: String, required: true, unique: true }, // UUID for embed script
    website_url: { type: String },
    primary_color: { type: String, default: '#2563eb' }, // Default blue
    is_active: { type: Boolean, default: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ChatWidget', chatWidgetSchema);
