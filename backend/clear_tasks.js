const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const result = await Task.deleteMany({});
        console.log(`Deleted ${result.deletedCount} tasks.`);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
});
