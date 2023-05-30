const express = require("express");
const {
  sendEmailMessageController,
} = require("../../controllers/emailMessage/emailMessageController");

const emailMessageRoute = express.Router();

emailMessageRoute.post("/", sendEmailMessageController);

module.exports = emailMessageRoute;
