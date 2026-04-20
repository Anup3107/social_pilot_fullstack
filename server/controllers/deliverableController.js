const Deliverable = require('../models/Deliverable');

const getDeliverables = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.client) filter.client = req.query.client;
    const deliverables = await Deliverable.find(filter)
      .populate('client', 'name color')
      .sort({ deadline: 1 });
    res.json({ success: true, count: deliverables.length, data: deliverables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.create({ ...req.body, user: req.user._id });
    const populated = await deliverable.populate('client', 'name color');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name color');
    if (!deliverable) return res.status(404).json({ success: false, message: 'Deliverable not found' });
    res.json({ success: true, data: deliverable });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deliverable) return res.status(404).json({ success: false, message: 'Deliverable not found' });
    res.json({ success: true, message: 'Deliverable deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDeliverables, createDeliverable, updateDeliverable, deleteDeliverable };
