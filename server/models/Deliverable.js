const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Deliverable title is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['content calendar', 'report', 'audit', 'strategy', 'design', 'video', 'other'],
    default: 'other',
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  notes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Review', 'Completed'],
    default: 'Not Started',
  },
}, { timestamps: true });

module.exports = mongoose.model('Deliverable', deliverableSchema);
