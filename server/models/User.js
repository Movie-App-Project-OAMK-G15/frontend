import pool from "../helpers/db.js";

const getAllUsers = async() => {
    return pool.query('select * from account;')
}

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

const addBio = async (userId, bio) => {
    return pool.query("UPDATE account SET bio = $1 WHERE user_id = $2", 
        [bio, userId]
    );
};

const getBio = async (userId) => {
    return pool.query("SELECT bio FROM account WHERE user_id = $1", 
        [userId]
    );
};

const updateProfilePic = async(userId, profilePicUrl) => {
    return pool.query("UPDATE account SET user_photo = $1 WHERE user_id = $2",
        [profilePicUrl, userId]
    )
}

const getProfilePic = async(userId) => {
    return pool.query("SELECT user_photo FROM account WHERE user_id = $1",
        [userId]
    )
}


export { postUser, selectUserByEmail, deleteUser, postFavMovie, getAllFavMovies, getAllUsers, addBio, getBio, updateProfilePic, getProfilePic };