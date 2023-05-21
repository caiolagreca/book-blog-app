const express = require("express");
const {
  userRegisterController,
  loginUserController,
} = require("../../controllers/users/usersController");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", loginUserController);

/*  
  //fetch all users
  app.get("/api/users", (req, res) => {
    res.json({ user: "fetch all users" });
  }); */

module.exports = userRoutes;
