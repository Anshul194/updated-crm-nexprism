const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: false
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: false
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 0
    },
    note: {
        type: String,
        default: ''
    },
    isRunning: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
timeEntrySchema.index({ userId: 1, startTime: -1 });
timeEntrySchema.index({ projectId: 1 });
timeEntrySchema.index({ taskId: 1 });

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
