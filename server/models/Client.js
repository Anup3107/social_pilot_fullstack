const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Lead', 'Paused', 'Inactive'],
    default: 'Active',
  },
  retainer: {
    type: Number,
    default: 0,
    min: 0,
  },
  platforms: [{
    type: String,
    enum: ['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'Pinterest', 'Snapchat'],
  }],
  notes: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#6c63ff',
  },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
