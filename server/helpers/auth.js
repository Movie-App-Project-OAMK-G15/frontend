import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
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

export {auth}