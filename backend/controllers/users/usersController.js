const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const generateToken = require("../../config/token/generateToken");
const validateMongoId = require("../../utils/validateMongoId");
const cloudinaryUploadImg = require("../../utils/cloudinary");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

/* Register */
const userRegisterController = expressAsyncHandler(async (req, res) => {
  //Check if user exists
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) throw new Error("User already exists");

  try {
    // Register user
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

/* Login */
const loginUserController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const userFound = await User.findOne({ email });
  //check if password matchs
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error(`Login credentials are not valid`);
  }
});

const fetchUsersController = expressAsyncHandler(async (req, res) => {
  console.log(req.headers);
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

const deleteUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user is valid
  validateMongoId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

const fetchUserDetailsController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user is valid
  validateMongoId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const userProfileController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

const updateUserController = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  console.log(req.user);
  validateMongoId(_id);

  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

const updateUserPasswordController = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoId(_id);
  //find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updateUser = await user.save();
    res.json(updateUser);
  }
  res.json(user);
});

const followingUserController = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) throw new Error("You have already followed this User");

  //1. Find the user you want to follow and update it's followers field
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );

  //2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );
  res.json("You have successfully followed this user");
});

const unfollowingUserController = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;

  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );

  res.json("You have successfully unfollowed this user");
});

const blockUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    { new: true }
  );
  res.json(user);
});

const unblockUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    { new: true }
  );
  res.json(user);
});

const generateVerificationTokenController = expressAsyncHandler(
  async (req, res) => {
    const loginUserId = req.user.id;
    const user = await User.findById(loginUserId);

    try {
      const verificationToken = await user.createAccountVerificationToken();
      await user.save();

      const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your acccount</a>`;
      const msg = {
        to: "sfsfs@hotmail.com",
        from: "caiomiranda701@gmail.com",
        subject: "My first Node email send",
        html: resetURL,
      };
      await sgMail.send(msg);
      res.json(resetURL);
    } catch (error) {
      res.json(error);
    }
  }
);

const accountVerificationController = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashedToken);

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("Token expired, try again later");

  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
});

const forgetPassowrdToken = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/reset-password/${token}">Click to reset your password</a>`;
    const msg = {
      to: email,
      from: "caiomiranda701@gmail.com",
      subject: "Reset password",
      html: resetURL,
    };

    await sgMail.send(msg);
    res.json({
      msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
    });
  } catch (error) {
    res.json(error);
  }
});

const passwordResetController = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, try again later");

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const profilePhotoUploadController = expressAsyncHandler(async (req, res) => {
  //Find the login user
  const { _id } = req.user;

  //1. Get the oath to img
  const localPath = `public/images/profile/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded?.url,
    },
    { new: true }
  );
  res.json(foundUser);
});

module.exports = {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUserController,
  fetchUserDetailsController,
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
};
