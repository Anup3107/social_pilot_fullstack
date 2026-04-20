const mongoose = require('mongoose');

const scheduledPostSchema = new mongoose.Schema({
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
    required: [true, 'Post title is required'],
    trim: true,
  },
  caption: {
    type: String,
    default: '',
  },
  platform: {
    type: String,
    enum: ['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter', 'YouTube', 'Pinterest'],
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled time is required'],
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Published', 'Failed', 'Draft'],
    default: 'Scheduled',
  },
  hashtags: [String],
  mediaUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('ScheduledPost', scheduledPostSchema);
