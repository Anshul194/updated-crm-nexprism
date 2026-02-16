const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatConversationSchema = new Schema({
    widget_id: { type: Schema.Types.ObjectId, ref: 'ChatWidget', required: true },
    visitor_id: { type: String, required: true }, // Unique ID generated on client side and stored in local storage
    visitor_name: { type: String },
    visitor_email: { type: String },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    unread_count: { type: Number, default: 0 },
    last_message: { type: String },
    last_message_time: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
