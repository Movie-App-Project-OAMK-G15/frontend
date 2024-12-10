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

const checkInfoLeftAfterDeleting = async(email) => {
    const result = await pool.query('SELECT check_user_data_existence($1)', [email]);
    return result.rows[0].check_user_data_existence;
}

const insertUserAndDataForDelete = async() => {
    await pool.query('select populate_test_data();')
}

const getToken = (email) => {
    return sign(email, process.env.JWT_SECRET_KEY)
}

const insertTestReview = async() => {
    await pool.query("INSERT INTO review (user_email, review_content, likes, dislikes, movie_id, rating) VALUES ('jane@example.com', 'This movie was amazing! The plot twists kept me hooked.', 15, 2, 1, 5);")
}

const deleteTestData = async() => {
    await pool.query("DELETE FROM review where user_email = 'jane@example.com';")
}

export { initializeTestDb, deleteTestData, insertTestReview, insertTestUser, checkInfoLeftAfterDeleting, getToken, insertUserAndDataForDelete }