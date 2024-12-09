import fs from 'fs'
import path from 'path'
import pool from './db.js'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const __dirname = import.meta.dirname
const { sign } = jwt

const initializeTestDb = async() => {
    const sql = fs.readFileSync(path.resolve(__dirname,"../test_db.sql"), "utf-8")
    await pool.query(sql)
}

const insertTestUser = async(firstname, familyname, email, password) => {
    hash(password, 10, (error, hashedPassword) => {
        pool.query('insert into account (firstname, familyname, email, password) values ($1, $2, $3, $4);',
            [firstname, familyname, email, hashedPassword]
        )
    })
}

const getToken = (email) => {
    return sign(email, process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }