const ScheduledPost = require('../models/ScheduledPost');

const getPosts = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.client) filter.client = req.query.client;
    const posts = await ScheduledPost.find(filter)
      .populate('client', 'name color')
      .sort({ scheduledAt: 1 });
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await ScheduledPost.create({ ...req.body, user: req.user._id });
    const populated = await post.populate('client', 'name color');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await ScheduledPost.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    ).populate('client', 'name color');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await ScheduledPost.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPosts, createPost, updatePost, deletePost };
