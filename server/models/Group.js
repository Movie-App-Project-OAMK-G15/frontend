// CREATE TABLE groups (
//     group_id SERIAL PRIMARY KEY,
//     admin_email VARCHAR(100) NOT NULL,
//     group_name VARCHAR(100) NOT NULL UNIQUE,
// 	   description VARCHAR(255) NOT NULL,
//     FOREIGN KEY (admin_email) REFERENCES account(email) ON DELETE SET NULL
// );

import pool from "../helpers/db.js";

const postGroup = async(adm_mail, g_name, description, photo) => {
    return pool.query('insert into groups (admin_email, group_name, description, photo) values ($1, $2, $3, $4) returning *;', 
            [adm_mail, g_name, description, photo])
}

const getAllGroups = async() => {
    return pool.query('select * from groups;')
} 

export { postGroup, getAllGroups }