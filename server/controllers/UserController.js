import { selectUserByEmail, postUser, deleteUser } from "../models/User.js";
import { ApiError } from "../helpers/errorClass.js";
import { compare, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
const { sign } = jwt

const createUserObject = (id, email, firstname, familyname, token=undefined) => {
    return {
        id: id,
        firstname: firstname,
        familyname: familyname,
        email: email,
        ...(token !== undefined) && {token: token}
    }
}

async function postRegistration(req, res, next) {
    try {
        if(!req.body.firstname || req.body.email.firstname === 0) return next(new ApiError('Invalid firstname for user', 400))
        if(!req.body.familyname || req.body.email.familyname === 0) return next(new ApiError('Invalid familyname for user', 400))
        if(!req.body.email || req.body.email.length === 0) return next(new ApiError('Invalid email for user', 400))
        if(!req.body.password || req.body.password.length < 8) return next(new ApiError('Invalid password for user', 400))
        const hashedPassword = await hash(req.body.password, 10)
        const result = await postUser(req.body.firstname, req.body.familyname, req.body.email, hashedPassword)
        const user = result.rows[0]
        return res.status(200).json(createUserObject(user.id, user.firstname, user.familyname, user.email))
    } catch (error) {
        return next(error)
    }
}   

async function postLogin(req, res, next) {
    try {
        const userFromDb = await selectUserByEmail(req.body.email)
        if(userFromDb.rowCount === 0) return next(new ApiError('Invalid credentials', 401))
        const user = userFromDb.rows[0]
        if(!await compare(req.body.password, user.password)) return next(new ApiError('Invalid credentials', 401))
        
        const token = sign({email: req.body.email}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        return res.status(200).json(createUserObject(user.id, user.firstname, user.familyname, user.email, token))
    } catch (error) {
        return next(error)
    }
}

async function deleteAccount(req, res, next) {
    try {
        if(!req.body.email || req.body.email.length === 0) return next(new ApiError('Invalid email for user', 400))
        const result = await deleteUser(req.body.email)
        if (result.rowCount > 0) {
            return res.status(200).json({message: `user with email: ${req.body.email} has been deleted`})
        } else {
            return next(new ApiError('No account to delete found', 400))
        }
    } catch (error) {
        return next(error)
    }
}

export { postRegistration, postLogin, deleteAccount }