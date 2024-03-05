import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;


const UserRole = db.define('roles_users', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id' // Reference the 'id' column in the 'users' table
        }
    },
    roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'roles',
            key: 'id' // Reference the 'id' column in the 'roles' table
        }
    }
}, {
    freezeTableName: true
});


export {UserRole}