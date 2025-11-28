const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const postRoutes = require('./postRoutes');
const commentRoutes = require('./commentRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/comment', commentRoutes);
router.use('/user', userRoutes);

module.exports = router;