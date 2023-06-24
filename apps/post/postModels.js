import {DataTypes} from 'sequelize'
import { sequelize } from '../../db.js';
import { User } from '../user/userModel.js';


export const Post = sequelize.define('posts', {
    desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }});


// --- relations between users and posts
User.hasMany(Post)
Post.belongsTo(User)


// Relationships model
export const Relationships = sequelize.define('relationships', {
    followeduserid: {
      type: DataTypes.INTEGER,
      references: { model: User, field: 'id' },
    },
    followeruserid: {
      type: DataTypes.INTEGER,
      references: { model: User, field: 'id' },
    },
});



// Relationships model
export const Comments = sequelize.define('comments', {
    commet_userid: {
      type: DataTypes.INTEGER,
      references: { model: User, field: 'id' },
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: { model: Post, field: 'id' },
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

sequelize.sync()