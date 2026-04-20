const express = require('express');
const { generateCaptions, generateHashtags, generateIdeas, getInsights, generateCalendar } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/captions', generateCaptions);
router.post('/hashtags', generateHashtags);
router.post('/ideas', generateIdeas);
router.post('/insights', getInsights);
router.post('/calendar', generateCalendar);

module.exports = router;
