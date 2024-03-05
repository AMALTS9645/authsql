import { Sequelize } from "sequelize";


const db = new Sequelize('genai', 'root', '$Aswamph9645s', {
    host: "localhost",
    dialect: "mysql"
});

// Define your model for the users table
const User = db.define('users', {
    userId: { // Change the primary key column name to userId
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    refresh_token: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true
});

// Define the roles model
const Role = db.define('roles', {
    roleId: { // Change the primary key column name to roleId
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true // Each role name should be unique
    }
}, {
    freezeTableName: true
});

// Define the features model
const Feature = db.define('features', {
    featureId: { // Change the primary key column name to featureId
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true // Each feature name should be unique
    }
}, {
    freezeTableName: true
});

// Define the role_features model to establish the many-to-many relationship between roles and features
const RoleFeature = db.define('role_features', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true // Add auto-increment option for the id column
    },
    roleId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'roles',
            key: 'roleId'
        }
    },
    featureId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'features',
            key: 'featureId'
        }
    }
}, {
    freezeTableName: true
});

// Define the roles_users model to establish the many-to-many relationship between users and roles
const UserRole = db.define('roles_users', {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id' // Reference the 'id' column in the 'users' table
        }
    },
    roleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: 'roles',
            key: 'id' // Reference the 'id' column in the 'roles' table
        }
    }
}, {
    freezeTableName: true
});


// Define associations between models (if needed)

// Synchronize the models with the database, creating tables if they don't exist
(async () => {
    await db.sync();
})();

export default db;
