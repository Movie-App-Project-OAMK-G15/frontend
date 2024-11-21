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

const postFavMovie = async(movie_id, user_id) => {
    return pool.query("INSERT INTO favorite_movies (movie_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [movie_id, user_id]
      );
}

const getAllFavMovies = async(user_id) => {
    return pool.query("SELECT * FROM favorite_movies WHERE user_id = $1",
        [user_id]
      );
}


export { postUser, selectUserByEmail, deleteUser, postFavMovie, getAllFavMovies }