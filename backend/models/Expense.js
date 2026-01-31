const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    paymentMode: { type: String, required: true },
    paidBy: { type: String, required: true },
    note: { type: String },
    receipt: { type: String }, // URL or path
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
