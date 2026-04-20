const express = require('express');
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getPosts).post(createPost);
router.route('/:id').put(updatePost).delete(deletePost);

module.exports = router;
