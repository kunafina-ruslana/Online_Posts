const { Comment, Post, User } = require('../models/bd');

const commentController = {
    create: async (req, res) => {
        try {
            const { content } = req.body;
            const postId = req.params.postId;

            const post = await Post.findByPk(postId);
            if (!post) {
                return res.status(404).render('error', { error: 'Пост не найден' });
            }

            await Comment.create({
                content,
                user_id: req.session.userId,
                post_id: postId
            });

            res.redirect(`/post/${postId}`);
        } catch (error) {
            console.error('Create comment error:', error);
            res.redirect(`/post/${req.params.postId}?error=Ошибка добавления комментария`);
        }
    },

    delete: async (req, res) => {
        try {
            const comment = await Comment.findByPk(req.params.id, {
                include: [Post]
            });

            if (!comment) {
                return res.status(404).render('error', { error: 'Комментарий не найден' });
            }

            if (comment.user_id !== req.session.userId && comment.Post.user_id !== req.session.userId) {
                return res.status(403).render('error', { error: 'Нет прав для удаления' });
            }

            const postId = comment.post_id;
            await comment.destroy();

            res.redirect(`/post/${postId}`);
        } catch (error) {
            console.error('Delete comment error:', error);
            res.redirect('back');
        }
    }
};

module.exports = commentController;