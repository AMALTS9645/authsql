import jwt from "jsonwebtoken";
import { Users } from "../models/UserModel.js"; // Assuming you've exported the Users model from UserModel.js

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        // Fetch user information from the database using the decoded userId
        const user = await Users.findByPk(decoded.userId); // Assuming you've added a findByPk method to the Users model
        if (!user) return res.sendStatus(403); // Or handle the case where the user is not found
        req.user = user; // Set the user object in the request for further processing
        next();
    });
};
