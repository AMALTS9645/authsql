import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const RoleFeature = db.define('role_features', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Add auto-increment option for the id column
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'roles',
            key: 'roleId'
        }
    },
    featureId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'features',
            key: 'featureId'
        }
    }
}, {
    freezeTableName: true
});

export {RoleFeature}