import pool from "../helpers/db.js";

// Retrieves all users from the 'account' table.
const getAllUsers = async () => {
    return pool.query('select * from account;');
};

// Fetches a specific user by their ID.
const getUserById = async (userId) => {
    return pool.query('select * from account where user_id = $1;', [userId]);
};

// Retrieves the encrypted email verification token for a user.
const getEncryptedToken = async (userId) => {
    return pool.query('select email_verif from account where user_id = $1;', [userId]);
};

// Updates a user's account to confirm their email and clears the verification token.
const setConfirmation = async (userId) => {
    return pool.query(
        'UPDATE account SET isConfirmed = true, email_verif = null WHERE user_id = $1 RETURNING *;',
        [userId]
    );
};

// Saves an email verification token for a user.
const setSignupToken = async (token, userId) => {
    return pool.query('UPDATE account SET email_verif = $1 WHERE user_id = $2 RETURNING *;', [token, userId]);
};

// Adds a new user to the 'account' table.
const postUser = async (firstname, familyname, email, hashedPassword) => {
    return pool.query(
        'insert into account (firstname, familyname, email, password) values ($1, $2, $3, $4) returning *;',
        [firstname, familyname, email, hashedPassword]
    );
};

// Retrieves a user by their email address.
const selectUserByEmail = async (email) => {
    return pool.query("select * from account where email=$1;", [email]);
};

// Deletes a user and all their related data using a stored procedure.
const deleteUser = async (email) => {
    return pool.query("select delete_user_and_related_data($1);", [email]);
};

// Adds a movie to a user's list of favorite movies, ignoring duplicates.
const postFavMovie = async (movie_id, user_id) => {
    return pool.query(
        "INSERT INTO favorite_movies (movie_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;",
        [movie_id, user_id]
    );
};

// Retrieves all favorite movies for a specific user.
const getAllFavMovies = async (user_id) => {
    return pool.query("SELECT * FROM favorite_movies WHERE user_id = $1;", [user_id]);
};

// Updates the bio of a user.
const addBio = async (userId, bio) => {
    return pool.query("UPDATE account SET bio = $1 WHERE user_id = $2;", [bio, userId]);
};

// Retrieves the bio of a user.
const getBio = async (userId) => {
    return pool.query("SELECT bio FROM account WHERE user_id = $1;", [userId]);
};

// Updates the profile picture URL for a user.
const updateProfilePic = async (userId, profilePicUrl) => {
    return pool.query("UPDATE account SET user_photo = $1 WHERE user_id = $2;", [profilePicUrl, userId]);
};

// Retrieves the profile picture URL of a user.
const getProfilePic = async (userId) => {
    return pool.query("SELECT user_photo FROM account WHERE user_id = $1;", [userId]);
};

export { 
    postUser, 
    setConfirmation, 
    getEncryptedToken, 
    getUserById, 
    selectUserByEmail, 
    setSignupToken, 
    deleteUser, 
    postFavMovie, 
    getAllFavMovies, 
    getAllUsers, 
    addBio, 
    getBio, 
    updateProfilePic, 
    getProfilePic 
};
