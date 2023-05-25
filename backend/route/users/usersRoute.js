const express = require("express");
const {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUserController,
  userProfileController,
  updateUserController,
  updateUserPasswordController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", loginUserController);
userRoutes.get("/", authMiddleware, fetchUsersController);
userRoutes.put("/password", authMiddleware, updateUserPasswordController);
userRoutes.get("/profile/:id", authMiddleware, userProfileController);
userRoutes.put("/:id", authMiddleware, updateUserController);
userRoutes.delete("/:id", deleteUserController);
userRoutes.get("/:id", fetchUsersController);

module.exports = userRoutes;
