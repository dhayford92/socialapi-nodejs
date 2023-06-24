import {DataTypes} from 'sequelize'
import { sequelize } from '../../db.js';


export const User = sequelize.define('users', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profilePc: {
        type: DataTypes.STRING,
        allowNull: true
    },
});


// // -- Relations
sequelize.sync()