import express from "express";
import { getUsers, Register, Login, Logout,getUserById,deleteUser, softDeleteRoleFeatures } from "../controllers/Users.js";
import { createRole, createFeature,  getAllRoles, getAllFeatures,assignRoleToUser, assignFeatureToRole,getFeaturesByRole, getRolesByUser } from "../controllers/Users.js"; // Import the new controller functions
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
const router = express.Router();
 
router.get('/users',  getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

router.get('/roles', getAllRoles); // Route to get all roles
router.post('/roles', createRole); // Route to create a role
router.delete('/roles', softDeleteRoleFeatures); // Route to create a role

router.get('/features', getAllFeatures); // Route to get all features
router.post('/features', createFeature); // Route to create a feature

router.post('/users/:userId/roles', assignRoleToUser); // Assign Role to User
router.post('/roles/:roleId/features', assignFeatureToRole); // Assign Feature to Role
router.get('/roles/:roleId/features', getFeaturesByRole); // Get features by role
router.get('/users/:userId/roles', getRolesByUser); // Get roles by user

router.get('/verify-token', (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Get the token from the 'Authorization' header
  
    if (token) {
      try {
        const decodedToken = jwt.verify(token, secretKey); // Verify and decode the token
        res.json(decodedToken); // Respond with the decoded token data
      } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'No token provided' });
    }
  });

  

//router.get('/users', verifyToken, getAllUsers); 
export default router;