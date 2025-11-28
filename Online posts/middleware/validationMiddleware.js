const validateRegistration = (req, res, next) => {
    const { username, email, login, password } = req.body;
    
    if (!username || !email || !login || !password) {
        return res.render('register', { error: 'Все поля обязательны для заполнения' });
    }
    
    if (password.length < 3) {
        return res.render('register', { error: 'Пароль должен быть не менее 6 символов' });
    }
    
    next();
};

const validatePost = (req, res, next) => {
    const { title } = req.body;
    
    if (!title) {
        return res.render('post/create', { error: 'Заголовок обязателен' });
    }
    
    next();
};

const validateComment = (req, res, next) => {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
        return res.redirect('back');
    }
    
    next();
};

module.exports = {
    validateRegistration,
    validatePost,
    validateComment
};