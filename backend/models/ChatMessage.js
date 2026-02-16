const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
    conversation_id: { type: Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
    sender_type: { type: String, enum: ['admin', 'visitor', 'system'], required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'timestamp' } });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
