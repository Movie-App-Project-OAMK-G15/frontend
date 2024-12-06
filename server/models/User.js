import pool from "../helpers/db.js";

const getAllUsers = async() => {
    return pool.query('select * from account;')
}

const getUserById = async(userId) => {
    return pool.query('select * from account where user_id = $1;',
        [userId]
    )
}

const getEncryptedToken = async(userId) => {
    return pool.query('select email_verif from account where user_id = $1;',
        [userId]
    )
}

const setConfirmation = async(userId) => {
    return pool.query(
        'UPDATE account SET isConfirmed = true, email_verif = null WHERE user_id = $1 RETURNING *;',
        [userId]
    );
};


const setSignupToken = async(token, userId) => {
    return pool.query('UPDATE account SET email_verif = $1 WHERE user_id = $2 RETURNING *', 
        [token, userId]
    )
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
    return pool.query("select delete_user_and_related_data($1)",
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


export { postUser, setConfirmation, getEncryptedToken, getUserById, selectUserByEmail, setSignupToken, deleteUser, postFavMovie, getAllFavMovies, getAllUsers, addBio, getBio, updateProfilePic, getProfilePic };