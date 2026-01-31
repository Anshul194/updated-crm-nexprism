const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get today's attendance for a user
router.get('/today/:userId', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            userId: req.params.userId,
            date: today
        });

        res.json(attendance || { status: 'absent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check-in
router.post('/check-in', async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({ userId, date: today });

        if (attendance) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        attendance = new Attendance({
            userId,
            date: today,
            checkIn: new Date(),
            status: 'present'
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Break Start
router.post('/break-start', async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance) {
            return res.status(404).json({ message: 'No attendance record found for today' });
        }

        if (attendance.status === 'on-break') {
            return res.status(400).json({ message: 'Already on break' });
        }

        attendance.breaks.push({ start: new Date() });
        attendance.status = 'on-break';
        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Break End
router.post('/break-end', async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance || attendance.status !== 'on-break') {
            return res.status(400).json({ message: 'Not on break' });
        }

        const lastBreak = attendance.breaks[attendance.breaks.length - 1];
        lastBreak.end = new Date();

        const breakDuration = Math.floor((lastBreak.end - lastBreak.start) / 1000 / 60);
        attendance.totalBreakTime += breakDuration;
        attendance.status = 'present';

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Check-out
router.post('/check-out', async (req, res) => {
    try {
        const { userId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance) {
            return res.status(404).json({ message: 'No attendance record found' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out' });
        }

        if (attendance.status === 'on-break') {
            return res.status(400).json({ message: 'Finish your break first' });
        }

        attendance.checkOut = new Date();
        attendance.status = 'checked-out';

        // Calculate total work time
        const totalDuration = Math.floor((attendance.checkOut - attendance.checkIn) / 1000 / 60);
        attendance.totalWorkTime = totalDuration - attendance.totalBreakTime;

        // Half-day Logic (e.g., < 4 hours)
        if (attendance.totalWorkTime < 240) {
            attendance.isHalfDay = true;
            attendance.status = 'half-day';
        }

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get attendance history for a user
router.get('/history/:userId', async (req, res) => {
    try {
        const history = await Attendance.find({ userId: req.params.userId })
            .sort({ date: -1 })
            .limit(30);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
