const express = require("express");
const {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUserController,
  userProfileController,
  updateUserController,
  updateUserPasswordController,
  followingUserController,
  unfollowingUserController,
  blockUserController,
  unblockUserController,
  generateVerificationTokenController,
  accountVerificationController,
  forgetPassowrdToken,
  passwordResetController,
  profilePhotoUploadController,
} = require("../../controllers/users/usersController");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewares/uploads/photoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", loginUserController);
userRoutes.put(
  "/profile-photo-upload",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadController
);
userRoutes.get("/", authMiddleware, fetchUsersController);
userRoutes.post("/forget-password-token", forgetPassowrdToken);
userRoutes.put("/reset-password", passwordResetController);
userRoutes.put("/password", authMiddleware, updateUserPasswordController);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenController
);

userRoutes.put(
  "/verify-account",
  authMiddleware,
  accountVerificationController
);
userRoutes.put("/follow", authMiddleware, followingUserController);
userRoutes.put("/unfollow", authMiddleware, unfollowingUserController);
userRoutes.put("/block-user/:id", authMiddleware, blockUserController);
userRoutes.put("/unblock-user/:id", authMiddleware, unblockUserController);
userRoutes.get("/profile/:id", authMiddleware, userProfileController);
userRoutes.put("/:id", authMiddleware, updateUserController);
userRoutes.delete("/:id", deleteUserController);
userRoutes.get("/:id", fetchUsersController);

module.exports = userRoutes;
