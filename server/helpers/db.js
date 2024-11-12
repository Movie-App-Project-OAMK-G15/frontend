import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Pool } = pkg;

const environment = process.env.NODE_ENV

// connect to db
const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: environment === 'development' ? process.env.DB_NAME : process.env.TEST_DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.SSL
})

export default pool 