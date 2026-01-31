const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const PipelineStage = require('../models/PipelineStage');

// --- STAGES ROUTES ---

// GET all stages
router.get('/stages', async (req, res) => {
    try {
        const stages = await PipelineStage.find().sort({ order: 1 });
        // If no stages, seed default
        if (stages.length === 0) {
            const defaults = [
                { id: 'new', label: 'New Leads', color: 'bg-blue-500', order: 0 },
                { id: 'discussion', label: 'In Discussion', color: 'bg-yellow-500', order: 1 },
                { id: 'proposal', label: 'Proposal Sent', color: 'bg-purple-500', order: 2 },
                { id: 'closed', label: 'Closed / Won', color: 'bg-green-500', order: 3 },
            ];
            await PipelineStage.insertMany(defaults);
            return res.json(defaults);
        }
        res.json(stages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new stage
router.post('/stages', async (req, res) => {
    try {
        const stage = new PipelineStage({
            id: req.body.id,
            label: req.body.label,
            color: req.body.color,
            order: req.body.order || 0
        });
        const newStage = await stage.save();
        res.status(201).json(newStage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE stage
router.delete('/stages/:id', async (req, res) => {
    try {
        await PipelineStage.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Stage deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- LEADS ROUTES ---

// GET all leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new lead
router.post('/', async (req, res) => {
    try {
        const lead = new Lead(req.body);
        const newLead = await lead.save();
        res.status(201).json(newLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE lead
router.put('/:id', async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE lead
router.delete('/:id', async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Activity
router.post('/:id/activities', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        lead.activities.push({
            content: req.body.content,
            type: req.body.type || 'note',
            createdAt: new Date()
        });

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
