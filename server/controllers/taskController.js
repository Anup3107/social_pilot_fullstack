const Task = require('../models/Task');

// @desc    Get all tasks (optionally filter by client)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.client) filter.client = req.query.client;
    if (req.query.status) {
      // Support both ?status=Todo and ?status=Todo&status=In+Progress
      const statuses = Array.isArray(req.query.status)
        ? req.query.status
        : [req.query.status];
      filter.status = { $in: statuses };
    }

    const tasks = await Task.find(filter)
      .populate('client', 'name color')
      .sort({ dueDate: 1, createdAt: -1 });

    // Move tasks with no dueDate to the end
    const withDate    = tasks.filter(t => t.dueDate);
    const withoutDate = tasks.filter(t => !t.dueDate);
    const sorted = [...withDate, ...withoutDate];

    res.json({ success: true, count: sorted.length, data: sorted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user._id });
    const populated = await task.populate('client', 'name color');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name color');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
