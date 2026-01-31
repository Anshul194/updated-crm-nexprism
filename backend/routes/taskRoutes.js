const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper to update project progress
const updateProjectProgress = async (projectId) => {
    try {
        if (!projectId) return;
        const tasks = await Task.find({ projectId });
        if (tasks.length === 0) {
            await Project.findByIdAndUpdate(projectId, { progress: 0 });
            return;
        }
        const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
        const progress = Math.round((completedTasks / tasks.length) * 100);
        await Project.findByIdAndUpdate(projectId, { progress });
    } catch (err) {
        console.error("Progress update error:", err);
    }
};

// GET all tasks (optional filter by projectId)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.projectId) filter.projectId = req.query.projectId;
        if (req.query.assigneeId) filter.assigneeId = req.query.assigneeId;

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE a new task
router.post('/', async (req, res) => {
    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        await updateProjectProgress(newTask.projectId);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a task
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

        // Recalculate progress for the project
        await updateProjectProgress(updatedTask.projectId);

        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });

        // Recalculate progress for the project
        await updateProjectProgress(deletedTask.projectId);

        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
