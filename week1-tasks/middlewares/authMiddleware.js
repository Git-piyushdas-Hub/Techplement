import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
        
        token = req.headers.authorization.split(' ')[1];

        // Check for missing token
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, missing token value' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from the database and attach it to req.user
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password
        next();

        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
        
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

};

