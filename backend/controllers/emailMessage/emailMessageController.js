const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");

const sendEmailMessageController = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    const msg = {
      to,
      subject,
      text: message,
      from: "caiomiranda701@gmail.com",
    };
    await sgMail.send(msg);
    res.json("message sent");
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMessageController };
