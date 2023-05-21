const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");

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
    res.json(userFound);
  } else {
    res.status(401);
    throw new Error(`Login credentials are not valid`);
  }
});

module.exports = { userRegisterController, loginUserController };
