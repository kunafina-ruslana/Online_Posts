const { Post, User, Comment, Like } = require('../models/bd');

const postController = {
    index: async (req, res) => {
        try {
            const posts = await Post.findAll({
                where: { is_published: true },
                include: [
                    { 
                        model: User, 
                        attributes: ['id', 'username', 'avatarURL'] 
                    },
                    {
                        model: Comment,
                        attributes: ['id'],
                        required: false
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            res.render('index', { 
                posts: posts,
                user: req.session.user 
            });
        } catch (error) {
            console.error('Posts index error:', error);
            res.render('index', { 
                posts: [],
                user: req.session.user,
                error: 'Ошибка загрузки постов'
            });
        }
    },

    showCreate: (req, res) => {
        res.render('post/create', { error: null });
    },

    create: async (req, res) => {
        try {
            const { title, description, imageURL } = req.body;

            const post = await Post.create({
                title,
                description,
                imageURL,
                user_id: req.session.userId
            });

            res.redirect('/');
        } catch (error) {
            console.error('Create post error:', error);
            res.render('post/create', { error: 'Ошибка создания поста' });
        }
    },

    show: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [
                    { 
                        model: User, 
                        attributes: ['id', 'username', 'avatarURL', 'biography'] 
                    },
                    { 
                        model: Comment,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'username', 'avatarURL']
                            }
                        ],
                        order: [['created_at', 'DESC']]
                    }
                ]
            });

            if (!post) {
                return res.status(404).render('error', { error: 'Пост не найден' });
            }

            await post.increment('view_count');

            res.render('post/show', { 
                post: post,
                user: req.session.user 
            });
        } catch (error) {
            console.error('Show post error:', error);
            res.status(500).render('error', { error: 'Ошибка загрузки поста' });
        }
    },

    showEdit: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(404).render('error', { error: 'Пост не найден' });
            }

            if (post.user_id !== req.session.userId) {
                return res.status(403).render('error', { error: 'Нет прав для редактирования' });
            }

            res.render('post/edit', { 
                post: post,
                error: null 
            });
        } catch (error) {
            console.error('Show edit post error:', error);
            res.status(500).render('error', { error: 'Ошибка загрузки поста' });
        }
    },

    update: async (req, res) => {
        try {
            const { title, description, imageURL } = req.body;
            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(404).render('error', { error: 'Пост не найден' });
            }

            if (post.user_id !== req.session.userId) {
                return res.status(403).render('error', { error: 'Нет прав для редактирования' });
            }

            await post.update({
                title,
                description,
                imageURL
            });

            res.redirect(`/post/${post.id}`);
        } catch (error) {
            console.error('Update post error:', error);
            res.render('post/edit', { 
                post: await Post.findByPk(req.params.id),
                error: 'Ошибка обновления поста' 
            });
        }
    },

    delete: async (req, res) => {
        try {
            const post = await Post.findByPk(req.params.id);

            if (!post) {
                return res.status(404).render('error', { error: 'Пост не найден' });
            }

            if (post.user_id !== req.session.userId) {
                return res.status(403).render('error', { error: 'Нет прав для удаления' });
            }

            await post.destroy();
            res.redirect('/');
        } catch (error) {
            console.error('Delete post error:', error);
            res.redirect('/?error=Ошибка удаления поста');
        }
    }
};

module.exports = postController;