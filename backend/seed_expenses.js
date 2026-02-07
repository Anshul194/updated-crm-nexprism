const mongoose = require('mongoose');
const Expense = require('./models/Expense');
require('dotenv').config();

const seedExpenses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm');
        console.log('Connected to DB');

        const dummyExpenses = [
            {
                date: new Date(),
                amount: 1500,
                category: 'food-team',
                paymentMode: 'UPI',
                paidBy: 'Company',
                note: 'Team lunch'
            },
            {
                date: new Date(),
                amount: 5000,
                category: 'electricity',
                paymentMode: 'Bank Transfer',
                paidBy: 'Company',
                note: 'Feb Bill'
            }
        ];

        await Expense.insertMany(dummyExpenses);
        console.log('✅ Dummy expenses seeded');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedExpenses();
