const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Get all projects for current user
router.get('/', auth, async (req, res) => {
  const userProjects = global.db.projects.filter(p => p.owner === req.user.id);
  res.json(userProjects);
});

// Create new project
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  const newProject = {
    _id: Date.now().toString(),
    name: name || 'Untitled Diagram',
    owner: req.user.id,
    data: {},
    status: 'draft',
    updatedAt: new Date()
  };
  global.db.projects.push(newProject);
  res.json(newProject);
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  const project = global.db.projects.find(p => p._id === req.params.id && p.owner === req.user.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// Save project data
router.post('/:id/save', auth, async (req, res) => {
  const { name, data } = req.body;
  const index = global.db.projects.findIndex(p => p._id === req.params.id && p.owner === req.user.id);

  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  global.db.projects[index] = {
    ...global.db.projects[index],
    name: name || global.db.projects[index].name,
    data: data || global.db.projects[index].data,
    updatedAt: new Date()
  };

  res.json({ message: 'Project saved (In-Memory)', project: global.db.projects[index] });
});

module.exports = router;
