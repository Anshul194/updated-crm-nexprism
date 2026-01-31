const express = require('express');
const router = express.Router();
const File = require('../models/File');

// GET all files
router.get('/', async (req, res) => {
    try {
        const files = await File.find().sort({ uploadedAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single file
router.get('/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        res.json(file);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPLAOD/CREATE a new file record
// Note: This is just the metadata record. Real file upload usually involves multer or cloud storage.
// For now, we assume 'url' and metadata are passed in body (e.g. from frontend base64 or pre-signed url logic).
router.post('/', async (req, res) => {
    const file = new File({
        name: req.body.name,
        type: req.body.type,
        size: req.body.size,
        url: req.body.url,
        projectId: req.body.projectId,
        clientId: req.body.clientId,
        uploadedBy: req.body.uploadedBy
    });

    try {
        const newFile = await file.save();
        res.status(201).json(newFile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a file
router.put('/:id', async (req, res) => {
    try {
        const updatedFile = await File.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFile) return res.status(404).json({ message: 'File not found' });
        res.json(updatedFile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a file
router.delete('/:id', async (req, res) => {
    try {
        const deletedFile = await File.findByIdAndDelete(req.params.id);
        if (!deletedFile) return res.status(404).json({ message: 'File not found' });
        res.json({ message: 'File deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
