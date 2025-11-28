const { DataTypes } = require('sequelize');
const sequelize = require('./config');

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    login: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatarURL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    biography: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

const Post = sequelize.define("Post", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageURL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

const Like = sequelize.define('Like', {
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Определение связей
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Comment, { foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

User.belongsToMany(Post, { 
    through: Like, 
    foreignKey: 'user_id',
    as: 'LikedPosts'
});
Post.belongsToMany(User, { 
    through: Like, 
    foreignKey: 'post_id',
    as: 'LikedByUsers'
});

module.exports = {
    User,
    Post,
    Comment,
    Like,
    sequelize
};