const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/profile', requireAuth, userController.profile);
router.get('/profile/edit', requireAuth, userController.showEdit);
router.post('/profile/edit', requireAuth, userController.update);
router.post('/profile/password', requireAuth, userController.changePassword);

module.exports = router;