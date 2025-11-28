const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateComment } = require('../middleware/validationMiddleware');

router.post('/:postId/create', requireAuth, validateComment, commentController.create);
router.post('/:id/delete', requireAuth, commentController.delete);

module.exports = router;