const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Project = require('../models/Project');

// Get all projects for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('❌ Failed to fetch projects:', error.message);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  const { name } = req.body;
  try {
    const project = await Project.create({
      name: name || 'Untitled Diagram',
      owner: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    console.error('❌ Failed to create project:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to create project', detail: error.message });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('❌ Failed to fetch project:', error.message);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Save project data
router.post('/:id/save', authenticateToken, async (req, res) => {
  const { name, data } = req.body;
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { name, data },
      { new: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('❌ Failed to save project:', error.message);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

module.exports = router;
