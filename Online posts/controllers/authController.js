const bcrypt = require('bcryptjs');
const { User } = require('../models/bd');

const authController = {
    showLogin: (req, res) => {
        res.render('login', { error: null });
    },

    login: async (req, res) => {
        try {
            const { login, password } = req.body;
            
            const user = await User.findOne({ where: { login } });
            if (!user) {
                return res.render('login', { error: 'Пользователь не найден' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.render('login', { error: 'Неверный пароль' });
            }

            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.user = user;
            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.render('login', { error: 'Ошибка авторизации' });
        }
    },

    showRegister: (req, res) => {
        res.render('register', { error: null });
    },

    register: async (req, res) => {
        try {
            const { username, telephone, email, login, password, biography } = req.body;

            const existingUser = await User.findOne({ where: { login } });
            if (existingUser) {
                return res.render('register', { error: 'Пользователь с таким логином уже существует' });
            }

            const existingEmail = await User.findOne({ where: { email } });
            if (existingEmail) {
                return res.render('register', { error: 'Пользователь с таким email уже существует' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                telephone,
                email,
                login,
                password: hashedPassword,
                biography
            });

            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.user = user;
            res.redirect('/');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('register', { error: 'Ошибка регистрации' });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};

module.exports = authController;