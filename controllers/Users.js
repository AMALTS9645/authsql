import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Users } from "../models/UserModel.js";
import { Roles } from "../models/RoleModel.js";
import { Features } from "../models/FeatureModel.js";
import { UserRole } from "../models/UserRolesModel.js";
import { RoleFeature } from "../models/RoleFeaturesModel.js";

//User functions
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['userId', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// export const Register = async (req, res) => {
//     const { name, email, password } = req.body;
  
//     try {
//         const existingUser = await Users.findOne({ where: { email: email } });
  
//         if (existingUser) {
//             return res.status(400).json({ error: "Email is already registered. Please use a different email." });
//         }
  
//         const salt = await bcrypt.genSalt();
//         const hashPassword = await bcrypt.hash(password, salt);
  
//         await Users.create({
//             name: name,
//             email: email,
//             password: hashPassword,
//         });
  
//         return res.status(201).json({ msg: "Registration Successful" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "An error occurred during registration." });
//     }
// };

// export const Login = async (req, res) => {
//     try {
//         const user = await Users.findOne({
//             where: {
//                 email: req.body.email
//             }
//         });
//         const match = await bcrypt.compare(req.body.password, user.password);
//         if (!match) return res.status(400).json({ msg: "Wrong Password" });
//         const userId = user.userId;
//         const name = user.name;
//         const email = user.email;
//         const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
//             expiresIn: '15s'
//         });
//         const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
//             expiresIn: '1d'
//         });
//         await Users.update({ refresh_token: refreshToken }, {
//             where: {
//                 userId: userId
//             },
            
//         });
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             maxAge: 24 * 60 * 60 * 1000
//         });
//         res.json({ accessToken});
        
//     } catch (error) {
//         res.status(404).json({ msg: "Email not found" });
//     }
// };

export const Register = async (req, res) => {
    const { name, email, password, roleId } = req.body; // Add roleId to register user with a role
  
    try {
        const existingUser = await Users.findOne({ where: { email: email } });
  
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered. Please use a different email." });
        }
  
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
  
        const user = await Users.create({
            name: name,
            email: email,
            password: hashPassword,
        });
  
        // Assign the provided role to the newly registered user
        const role = await Roles.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        await user.addRole(role);
  
        return res.status(201).json({ msg: "Registration Successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred during registration." });
    }
};

// export const Login = async (req, res) => {
//     try {
//         const user = await Users.findOne({
//             where: {
//                 email: req.body.email
//             }
//         });
//         if (!user) {
//             return res.status(404).json({ msg: "Email not found" });
//         }
        
//         const match = await bcrypt.compare(req.body.password, user.password);
//         if (!match) return res.status(400).json({ msg: "Wrong Password" });

//         // Fetch roles associated with the user
//         const roles = await user.getRoles();
        
//         // Generate access token based on user's details
//         const userId = user.userId;
//         const name = user.name;
//         const email = user.email;
//         const accessToken = jwt.sign({ userId, name, email, roles }, process.env.ACCESS_TOKEN_SECRET, {
//             expiresIn: '15s'
//         });
//         const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
//             expiresIn: '1d'
//         });
//         await Users.update({ refresh_token: refreshToken }, {
//             where: {
//                 userId: userId
//             },
//         });
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             maxAge: 24 * 60 * 60 * 1000
//         });
//         res.json({ accessToken });
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

//features returned
// export const Login = async (req, res) => {
//     try {
//         const user = await Users.findOne({
//             where: {
//                 email: req.body.email
//             },
//             include: [
//                 {
//                     model: Roles,
//                     through: {
//                         attributes: [] // Exclude the join table attributes
//                     },
//                     include: Features // Include associated features
//                 }
//             ]
//         });

//         if (!user) {
//             return res.status(404).json({ msg: "Email not found" });
//         }
        
//         const match = await bcrypt.compare(req.body.password, user.password);
//         if (!match) return res.status(400).json({ msg: "Wrong Password" });

//         res.json({ user }); // Return user with roles and associated features
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            },
            include: [
                {
                    model: Roles,
                    through: {
                        attributes: [] // Exclude the join table attributes
                    },
                    include: Features // Include associated features
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ msg: "Email not found" });
        }
        
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });

        // Extracting features from user object
        const features = user.roles.flatMap(role => role.features);
        
        // Generate access token based on user's details
        const userId = user.userId;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign({ userId, name, email, features }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });

        res.json({ features, accessToken });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['userId', 'name', 'email'],
            include: [
                {
                    model: UserRole,
                    attributes: [], // Exclude attributes from the UserRole model
                    where: { userId: Sequelize.col('Users.userId') }, // Match userId with the User model's userId
                    include: {
                        model: Roles, // Include the Role model
                        attributes: ['name'] // Select specific attributes from the Role model
                    }
                }
            ]
            
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await Users.findOne({
            attributes: ['userId', 'name', 'email'],
            where: {
                userId: userId
            }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user) return res.sendStatus(204);
    const userId = user.userId;
    await Users.update({ refresh_token: null }, {
        where: {
            userId: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
};

export const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await Users.findOne({
            where: {
                userId: userId
            }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await Users.destroy({
            where: {
                userId: userId
            }
        });

        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

//role functions

export const createRole = async (req, res) => {
    const { name, featureIds } = req.body;

    try {
        const role = await Roles.create({ name });

        if (featureIds && featureIds.length > 0) {
            await role.setFeatures(featureIds);
        }

        res.status(201).json({ msg: 'Role created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAllRoles = async (req, res) => {
    try {
        const roles = await Roles.findAll({
            attributes: ['id', 'name'],
            include: [{
                model: Features,
                attributes: ['id', "name"], 
                through: { attributes: [] } 
            }] 
        });
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//feature funtions
export const createFeature = async (req, res) => {
    const { name, description, path, section } = req.body;

    try {
        await Features.create({ name, description, path, section });

        res.status(201).json({ msg: 'Feature created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAllFeatures = async (req, res) => {
    try {
        const features = await Features.findAll({
            attributes: ['id', 'name', 'description', 'section', 'path'] // Update 'featureId' to 'id'
        });
        res.json(features);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//role_user function
export const assignRoleToUser = async (req, res) => {
    const userId = req.params.userId;
    const { roleId } = req.body;

    try {
        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const role = await Roles.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ msg: 'Role not found' });
        }

        await user.addRole(role);

        res.status(200).json({ msg: 'Role assigned to user successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const getRolesByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by ID
        const user = await Users.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the roles associated with the user
        const roles = await user.getRoles();

        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//feature_role functions

export const assignFeatureToRole = async (req, res) => {
    const roleId = req.params.roleId;
    const { featureId } = req.body;

    try {
        const role = await Roles.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ msg: 'Role not found' });
        }

        const feature = await Features.findByPk(featureId);

        if (!feature) {
            return res.status(404).json({ msg: 'Feature not found' });
        }

        await role.addFeature(feature);

        res.status(200).json({ msg: 'Feature assigned to role successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};


export const getFeaturesByRole = async (req, res) => {
    const roleId = req.params.roleId;

    try {
        // Find the role by ID
        const role = await Roles.findByPk(roleId);

        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        // Get the features associated with the role
        const features = await role.getFeatures();

        res.json(features);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const softDeleteRoleFeatures = async (req, res) => {
    const { roleId } = req.params; // Assuming roleId is passed as a URL parameter
    try {
        // Find the role by id
        const role = await Roles.findByPk(roleId);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        // Remove all features associated with the role
        // await role.removeFeatures(); // Assuming you have defined the association in the Roles model
        
        // Alternatively, you can delete entries from the join table
        await role.setFeatures([]);

        res.json({ message: "Features removed from role" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

