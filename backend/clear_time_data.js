const mongoose = require('mongoose');
require('dotenv').config();

const TimeEntry = require('./models/TimeEntry');
const Task = require('./models/Task');

const clearData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        // 1. Clear Time Entries
        console.log('Deleting all time entries...');
        const deleteResult = await TimeEntry.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} time entries.`);

        // 2. Reset Tasks
        console.log('Resetting task timer fields...');
        const updateResult = await Task.updateMany(
            {},
            {
                $set: {
                    isTimerRunning: false,
                    lastStartTime: null,
                    totalTimeSpent: 0,
                    timeEntryId: null
                }
            }
        );
        console.log(`Updated ${updateResult.modifiedCount} tasks.`);

        console.log('Successfully cleared time tracking data!');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearData();
