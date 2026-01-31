const mongoose = require('mongoose');

const pipelineStageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // slug-like id
    label: { type: String, required: true },
    color: { type: String, default: 'bg-blue-500' },
    order: { type: Number, default: 0 }
});

module.exports = mongoose.model('PipelineStage', pipelineStageSchema);
