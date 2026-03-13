const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Object,
    default: {} // Stores diagram nodes, connections, etc.
  },
  status: {
    type: String,
    enum: ['Draft', 'In Review', 'Completed'],
    default: 'Draft'
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
