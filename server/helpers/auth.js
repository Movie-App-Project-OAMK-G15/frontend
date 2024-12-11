import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import pool from './db.js'
dotenv.config();
const { verify } = jwt
const authorizationRequired = 'Authorization required!'
const invalidCredentials = "Invalid credentials!"
const expiredToken = "Token expired!"

const auth = (req, res, next) => {
    if(!req.headers.authorization){
        res.statusMessage = authorizationRequired
        res.status(401).json({message: authorizationRequired})
    }else{
        try {
            const token = req.headers.authorization
            verify(token, process.env.JWT_SECRET_KEY)
            next()    
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.statusMessage = expiredToken
                return res.status(403).json({ message: expiredToken });
            } else {
                res.statusMessage = invalidCredentials
                return res.status(403).json({message: invalidCredentials})
            }
        }
    }
}

const checkIsAdmin = async(req, res, next) => {
    try {
        const token = req.headers.authorization
        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Failed to authenticate token' });
            }

            const email = decoded.email;  // Extract email from decoded token

            // Check if the user is an admin in the groups table
            const checkAdminRights = await pool.query(
                'SELECT admin_email FROM groups WHERE admin_email = $1',
                [email]
            );

            if (checkAdminRights.rows.length > 0) {
                return next();
            } else {
                return res.status(403).json({ message: 'Not an admin' });
            }
        });
    } catch (error) {
        
    }
}

export {auth, checkIsAdmin}