const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('Target URI:', process.env.MONGO_URI ? 'PROTECTED_URI' : 'UNDEFINED');

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`>>> DB CONNECTED: ${conn.connection.host} <<<`);
        return conn;
    } catch (error) {
        console.error(`>>> DB ERROR: ${error.message} <<<`);
        process.exit(1);
    }
};

module.exports = connectDB;
