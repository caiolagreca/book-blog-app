const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const validateMongoId = require("../../utils/validateMongoId");

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

module.exports = {
  userRegisterController,
  loginUserController,
  fetchUsersController,
  deleteUserController,
  fetchUserDetailsController,
  userProfileController,
  updateUserController,
  updateUserPasswordController,
};
