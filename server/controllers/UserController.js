import { selectUserByEmail, postUser, getUserById, setConfirmation, getEncryptedToken, setSignupToken, deleteUser, getAllFavMovies, postFavMovie, addBio, getBio, updateProfilePic, getProfilePic, getAllUsers } from "../models/User.js";
import { ApiError } from "../helpers/errorClass.js";
import { compare, hash } from "bcrypt";
import crypto from 'node:crypto';
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { uploadToImgBB } from "../helpers/uploadPhoto.js";

const createUserObject = (id, firstname, familyname, email, token = undefined) => {
  return {
    id: id,
    firstname: firstname,
    familyname: familyname,
    email: email,
    ...(token !== undefined && { token: token }),
    // ...(signupToken !== undefined && { sToken: signupToken }),
  };
};

const createSignupToken = async(userId)=>{
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedST = crypto.createHash('sha256').update(resetToken).digest('hex');

  try {
    const response = await setSignupToken(encryptedST, userId)
  if(response.rowCount > 0){
      return resetToken
  }
  } catch (error) {
    console.log(error)
  }
}

const verifyToken = (plainToken, encryptedToken) => {
  const hashedInput = crypto.createHash('sha256').update(plainToken).digest('hex');
  return hashedInput === encryptedToken;
};

async function verifyEmailByCode(req, res, next) {
  try {
    const userId = req.body.user_id
    console.log(userId)
    const token = req.body.token
    console.log(token)
    const response = await getUserById(userId)
    const userInfo = response.rows[0]

    if(userInfo.isconfirmed === true) return next(new ApiError("Your email has already been confirmed", 400));
    
    if(userInfo.email_verif !== null){
      console.log(userInfo.email_verif)
      if(verifyToken(token, userInfo.email_verif)){
        const update = await setConfirmation(userId)
        if(update.rowCount > 0){
          console.log('sucass')
          return res.status(200).json({successMessage: "Email has been verified successfully"}); 
        }
        return next(new ApiError("Invalid code", 400));
      }
    }else{
      return next(new ApiError("The confirmation code does not exist for this user", 404));
    }
  } catch (error) {
    return next(error);
  }
}

async function postRegistration(req, res, next) {
  try {
    if (!req.body.firstname || req.body.email.firstname === 0)
      return next(new ApiError("Invalid firstname for user", 400));
    if (!req.body.familyname || req.body.email.familyname === 0)
      return next(new ApiError("Invalid familyname for user", 400));
    if (!req.body.email || req.body.email.length === 0)
      return next(new ApiError("Invalid email for user", 400));
    if (!req.body.password || req.body.password.length < 8)
      return next(new ApiError("Invalid password for user", 400));
    const hashedPassword = await hash(req.body.password, 10);
    const result = await postUser(req.body.firstname, req.body.familyname, req.body.email, hashedPassword);
    const user = result.rows[0];
    return res.status(200).json(createUserObject(user.user_id, user.firstname, user.familyname, user.email));
  } catch (error) {
    return next(error);
  }
}

async function postLogin(req, res, next) {
  try {
    const userFromDb = await selectUserByEmail(req.body.email);
    console.log(userFromDb.rows[0])
    if (userFromDb.rowCount === 0)
      return next(new ApiError("Invalid credentials", 401));
    const user = userFromDb.rows[0];
    if (!(await compare(req.body.password, user.password)))
      return next(new ApiError("Invalid credentials", 401));
    if(!userFromDb.rows[0].isconfirmed)
      return next(new ApiError("Email is not confirmed", 403));

    const token = sign({ email: req.body.email }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
    return res.status(200).json(createUserObject(user.user_id, user.firstname, user.familyname, user.email, token));
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(req, res, next) {
  try {
    if (!req.body.email || req.body.email.length === 0)
      return next(new ApiError("Invalid email for user", 400));
    console.log(req.body.email)
    const result = await deleteUser(req.body.email);
    if (result.rowCount > 0) {
      return res
        .status(200)
        .json({ state: `user with email: ${req.body.email} has been deleted` });
    } else {
      return next(new ApiError("No account to delete found", 400));
    }
  } catch (error) {
    return next(error);
  }
}

//add favorite movie
const addFavorite = async (req, res, next) => {
  const { movie_id, user_id } = req.body;
  console.log(`Received request to add favorite movie. Movie ID: ${movie_id}, User ID: ${user_id}`);

  try {
    const result = await postFavMovie(movie_id, user_id)
    if(result.rowCount > 0){
        res.status(200).json({ message: "Movie added to favorites" });
    }else return next(new ApiError("No fav movie found", 400))
  } catch (error) {
    next(error);
  }
};

//get favorite movies for a user
const getFavorites = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const result = await getAllFavMovies(userId);
    if(result.rowCount > 0){
        res.status(200).json(result.rows);
    }
  } catch (error) {
    next(error);
  }
};

const updateUserBio = async (req, res, next) => {
  try {
    const { userId } = req.params; 
    const { bio } = req.body;
    if (!userId) {
      return next(new ApiError("User  ID is required", 400));
    }

    const result = await addBio(userId, bio);
    if (result.rowCount === 0) {
      return next(new ApiError("Failed to update bio", 400));
    }

    return res.status(200).json({ message: "Bio updated successfully" });
  } catch (error) {
      return next(error);
  }
}

const getUserBio = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next(new ApiError("User  ID is required", 400));
    }

    const result = await getBio(userId);
    if (result.rowCount === 0) {
      return next(new ApiError("No bio found for this user", 404));
    }
    const bio = result.rows[0].bio;
    return res.status(200).json({ bio });
  } catch (error) {
    return next(error);
  }
}

const changeProfilePic = async(req, res, next) => {
  try {
    const { userId } = req.params; 
    const { file } = req;
    const profilePicUrl = await uploadToImgBB(file.path);

    const result = await updateProfilePic(userId, profilePicUrl);
    console.log("Database update result:", result);
    if (result.rowCount === 0) {
        return next(new ApiError("Failed to update profile picture", 400));
    }

    return res.status(200).json({ message: "Profile picture updated successfully", user: result.rows[0] });
  } catch (error) {
    return next(error);
  }
}

const getProfilePicture = async (req, res, next) => {
  try {
      const { userId } = req.params; 
      console.log(userId)
      const response = await getProfilePic(userId);
      if (!response) {
          return next(new ApiError("User  not found", 404));
      }

      return res.status(200).json(response.rows);
  } catch (error) {
      return next(error);
  }
};

const creatTokenForSignUp = async (req, res, next) => {
  try {
      const tokenForUser = await createSignupToken(req.body.user_id);
      if (!tokenForUser) {
          return next(new ApiError("Token has not been granted", 500));
      }
      return res.status(200).json(tokenForUser);
  } catch (error) {
      return next(error);
  }
};

//getalluser
const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users.rows);
  } catch (error) {
    return next(error);
  }
};
export {
  postRegistration,
  postLogin,
  deleteAccount,
  addFavorite,
  getFavorites,
  updateUserBio,
  getUserBio,
  changeProfilePic,
  getProfilePicture,
  getAllUsersController,
  creatTokenForSignUp,
  verifyEmailByCode
};
