const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validatePost } = require('../middleware/validationMiddleware');

router.get('/', postController.index);
router.get('/create', requireAuth, postController.showCreate);
router.post('/create', requireAuth, validatePost, postController.create);
router.get('/:id', postController.show);
router.get('/:id/edit', requireAuth, postController.showEdit);
router.post('/:id/edit', requireAuth, validatePost, postController.update);
router.post('/:id/delete', requireAuth, postController.delete);

module.exports = router;