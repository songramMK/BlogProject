const express = require('express') ; 
const { multerMiddleware } = require('../config/cloudinary.config');
const { validRefreshToekn } = require('../utils/token.utils');
const { UpdateUser, deleteUser, SignOut } = require('../Controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware.middleware');

const UserRouter = express.Router() ; 

UserRouter.put(
  "/updateUser/:userId",
  multerMiddleware,
  authMiddleware,
  UpdateUser,
);
UserRouter.delete("/delete/:userId" , authMiddleware ,deleteUser );
UserRouter.post("/signOut" , SignOut) ; 



module.exports = UserRouter; 