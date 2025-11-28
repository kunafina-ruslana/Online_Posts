const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./models/bd');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);

app.get('/', async (req, res) => {
    try {
        const { Post, User, Comment } = require('./models/bd');
        
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
        console.error('Home page error:', error);
        res.render('index', { 
            posts: [],
            user: req.session.user,
            error: 'Ошибка загрузки постов'
        });
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { error: 'Внутренняя ошибка сервера' });
});

app.use((req, res) => {
    res.status(404).render('error', { error: 'Страница не найдена' });
});

async function initializeDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('База данных инициализирована');
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error);
    }
}

app.listen(PORT, async () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    await initializeDatabase();
});