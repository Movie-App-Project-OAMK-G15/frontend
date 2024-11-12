import fs from 'fs'
import path from 'path'
import pool from './db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const __dirname = import.meta.dirname
const { sign } = jwt

const initializeTestDb = async() => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../initial.sql"), "utf-8")
    await pool.query(sql)
}

const insertTestUser = async(email, password) => {
    hash(password, 10, (error, hashedPassword) => {
        pool.query('insert into account (email, password) values ($1, $2);',
            [email, hashedPassword]
        )
    })
}

const getToken = (email) => {
    return sign(email, process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }