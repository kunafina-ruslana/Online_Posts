const bcrypt = require('bcryptjs');
const { User, Post, Comment } = require('../models/bd');

const userController = {
    profile: async (req, res) => {
        try {
            const user = await User.findByPk(req.session.userId, {
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: Post,
                        order: [['created_at', 'DESC']]
                    }
                ]
            });

            if (!user) {
                return res.status(404).render('error', { error: 'Пользователь не найден' });
            }

            res.render('profile', { 
                user: user,
                currentUser: req.session.user 
            });
        } catch (error) {
            console.error('Profile error:', error);
            res.status(500).render('error', { error: 'Ошибка загрузки профиля' });
        }
    },

    showEdit: async (req, res) => {
        try {
            const user = await User.findByPk(req.session.userId, {
                attributes: { exclude: ['password'] }
            });

            res.render('profile/edit', { 
                user: user,
                error: null 
            });
        } catch (error) {
            console.error('Show edit profile error:', error);
            res.status(500).render('error', { error: 'Ошибка загрузки профиля' });
        }
    },

    update: async (req, res) => {
        try {
            const { username, telephone, email, biography } = req.body;
            const user = await User.findByPk(req.session.userId);

            await user.update({
                username,
                telephone,
                email,
                biography
            });

            req.session.user = user;
            req.session.username = user.username;

            res.redirect('/profile');
        } catch (error) {
            console.error('Update profile error:', error);
            const user = await User.findByPk(req.session.userId, {
                attributes: { exclude: ['password'] }
            });
            res.render('profile/edit', { 
                user: user,
                error: 'Ошибка обновления профиля' 
            });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findByPk(req.session.userId);

            const isValidPassword = await bcrypt.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.render('profile/edit', { 
                    user: user,
                    error: 'Текущий пароль неверен' 
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await user.update({ password: hashedPassword });

            res.redirect('/profile?success=Пароль успешно изменен');
        } catch (error) {
            console.error('Change password error:', error);
            const user = await User.findByPk(req.session.userId, {
                attributes: { exclude: ['password'] }
            });
            res.render('profile/edit', { 
                user: user,
                error: 'Ошибка смены пароля' 
            });
        }
    }
};

module.exports = userController;