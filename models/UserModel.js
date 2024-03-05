import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import { Features } from "./FeatureModel.js";
import { RoleFeature } from "./RoleFeaturesModel.js";
import { Roles } from "./RoleModel.js";
import { UserRole } from "./UserRolesModel.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    userId: { // Change the primary key column name to 'id'
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});


// Define associations between models
Users.belongsToMany(Roles, { through: UserRole, foreignKey: 'userId', otherKey: 'roleId' });
Roles.belongsToMany(Users, { through: UserRole, foreignKey: 'roleId', otherKey: 'userId' });

Roles.belongsToMany(Features, { through: RoleFeature, foreignKey: 'roleId', otherKey: 'featureId' });
Features.belongsToMany(Roles, { through: RoleFeature, foreignKey: 'featureId', otherKey: 'roleId' });

export {Users};

