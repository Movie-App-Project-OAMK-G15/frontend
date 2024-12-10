import { selectUserByEmail, postUser, getUserById, setConfirmation, getEncryptedToken, setSignupToken, deleteUser, getAllFavMovies, postFavMovie, addBio, getBio, updateProfilePic, getProfilePic, getAllUsers } from "../models/User.js";
import { ApiError } from "../helpers/errorClass.js";
import { compare, hash } from "bcrypt";
import { validateSignupInput } from "../helpers/credentialsValidation.js";
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
    //...(message !== undefined && {message: message })
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
    console.log('sasfa')
    console.log(req.body.token)
    if(!req.body.token)
      return next(new ApiError("No code provided", 400));

    const token = req.body.token
    const userID = parseInt(token.slice(6));
    const code = token.slice(0, 6);
    console.log('token: ' + code)
    console.log('id: ' + userID)
    const response = await getUserById(userID)
    const userInfo = response.rows[0]

    if(userInfo.isconfirmed === true) return next(new ApiError("Your email has already been confirmed", 400));
    
    if(userInfo.email_verif !== null){
      if(verifyToken(code, userInfo.email_verif)){
        const update = await setConfirmation(userID)
        if(update.rowCount > 0){
          return res.status(200).json({successMessage: "Email has been verified successfully"}); 
        }
      }else{
        return next(new ApiError("Invalid code", 400));
      }
    }else{
      return next(new ApiError("The confirmation code does not exist for this user", 404));
    }
  } catch (error) {
    console.log(error)
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

    const isValidEmailPassword = validateSignupInput(req.body.email, req.body.password)

    if(isValidEmailPassword.isValid){
      const hashedPassword = await hash(req.body.password, 10);
      const result = await postUser(req.body.firstname, req.body.familyname, req.body.email, hashedPassword);
      const user = result.rows[0];
      req.userData = createUserObject(user.user_id, user.firstname, user.familyname, user.email);
      return next();      
    }else{
        return next(new ApiError(isValidEmailPassword.message, 400));
    }
  } catch (error) {
    return next(error);
  }
}

async function postLogin(req, res, next) {
  try {
    if (!req.body.email || req.body.email.length === 0)
      return next(new ApiError("Invalid email for user", 400));
    if (!req.body.password || req.body.password.length === 0)
      return next(new ApiError("Invalid password for user", 400));

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
    console.log(result)
    if (result.rows[0].delete_user_and_related_data) {
      console.log('bro was deleted ')
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
    if (!req.userData || !req.userData.id) {
      return next(new ApiError("User data is missing", 400));
    }

    // Generate the token
    const tokenForUser = await createSignupToken(req.userData.id);
    if (!tokenForUser) {
      return next(new ApiError("Token has not been granted", 500));
    }

    // Attach the token to req.userData
    req.userData = createUserObject(
      req.userData.id,
      req.userData.firstname,
      req.userData.familyname,
      req.userData.email,
      tokenForUser
    );
    return next();
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
  verifyEmailByCode,
  createUserObject
};
