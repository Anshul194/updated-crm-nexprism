const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// Get all tickets
router.get('/', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create ticket
router.post('/', async (req, res) => {
    const ticket = new Ticket({
        subject: req.body.subject,
        description: req.body.description,
        priority: req.body.priority,
        clientName: req.body.clientName,
        assignedTo: req.body.assignedTo,
        screenshot: req.body.screenshot
    });
    try {
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update ticket
router.put('/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        if (req.body.status) ticket.status = req.body.status;
        if (req.body.priority) ticket.priority = req.body.priority;
        if (req.body.assignedTo) ticket.assignedTo = req.body.assignedTo;

        ticket.updatedAt = Date.now();
        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete ticket
router.delete('/:id', async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ message: 'Ticket deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
