const express = require('express');
const router = express.Router();
const LeadForm = require('../models/LeadForm');
const Lead = require('../models/Lead');

// Get all forms
router.get('/', async (req, res) => {
    try {
        const forms = await LeadForm.find().sort({ createdAt: -1 });
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create/Update form
router.post('/', async (req, res) => {
    const { id, title, description, fields, isActive } = req.body;
    try {
        if (id) {
            const form = await LeadForm.findByIdAndUpdate(id, { title, description, fields, isActive }, { new: true });
            return res.json(form);
        }
        const newForm = new LeadForm({ title, description, fields, isActive });
        const savedForm = await newForm.save();
        res.status(201).json(savedForm);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Public: Get form config
router.get('/public/:id', async (req, res) => {
    try {
        const form = await LeadForm.findById(req.params.id);
        if (!form || !form.isActive) {
            return res.status(404).json({ message: 'Form not found or inactive' });
        }
        res.json(form);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Public: Submit lead
router.post('/public/:id/submit', async (req, res) => {
    try {
        const form = await LeadForm.findById(req.params.id);
        if (!form || !form.isActive) {
            return res.status(404).json({ message: 'Form not found or inactive' });
        }

        // Map submission to Lead model
        // Assuming fields correspond to Lead properties or we store them in a way leads can handle
        // Default Lead fields: name, company, value, source, stage, email, phone
        const submission = req.body;
        const mainFields = ['name', 'company', 'email', 'phone', 'value', 'source', 'stage'];
        const customFields = {};

        Object.keys(submission).forEach(key => {
            if (!mainFields.includes(key)) {
                customFields[key] = submission[key];
            }
        });

        const newLead = new Lead({
            name: submission.name || 'Anonymous',
            company: submission.company || 'N/A',
            email: submission.email,
            phone: submission.phone,
            customFields,
            source: `Form: ${form.title}`,
            stage: 'new',
            activities: [{
                content: `Lead submitted via form: ${form.title}`,
                type: 'note'
            }]
        });

        await newLead.save();
        res.json({ success: true, message: 'Form submitted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
