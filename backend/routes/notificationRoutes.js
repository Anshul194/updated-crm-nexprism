const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for current context (simple for now)
router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark one as read
router.put('/:id/read', async (req, res) => {
    try {
        const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(notif);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark all as read
router.put('/mark-all-read', async (req, res) => {
    try {
        await Notification.updateMany({ read: false }, { read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
