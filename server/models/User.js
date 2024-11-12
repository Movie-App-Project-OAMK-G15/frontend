import pool from "../helpers/db.js";

const postUser = async(firstname, familyname, email, hashedPassword) => {
    return pool.query('insert into account (firstname, familyname, email, password) values ($1, $2, $3, $4) returning *;', 
            [firstname, familyname, email, hashedPassword])
}

const selectUserByEmail = async(email) => {
    return pool.query("select * from account where email=$1",
            [email])
}

const deleteUser = async(email) => {
    return pool.query("delete from account where email=$1",
        [email])
}

export { postUser, selectUserByEmail, deleteUser }