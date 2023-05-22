const express = require("express");
const {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUserController,
  userProfileController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", loginUserController);
userRoutes.get("/", authMiddleware, fetchUsersController);
userRoutes.get("/profile/:id", authMiddleware, userProfileController);
userRoutes.delete("/:id", deleteUserController);
userRoutes.get("/:id", fetchUsersController);

module.exports = userRoutes;
