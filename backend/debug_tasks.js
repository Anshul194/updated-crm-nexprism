const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const tasks = await Task.find({}, 'title status');
        console.log("JSON_START");
        console.log(JSON.stringify(tasks, null, 2));
        console.log("JSON_END");
    } catch (e) {
        console.error(e);
    } finally {
        setTimeout(() => process.exit(), 1000);
    }
});
