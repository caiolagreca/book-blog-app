const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const Filter = require("bad-words");
const EmailMessage = require("../../model/emailMessage/EmailMessage");

const sendEmailMessageController = expressAsyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  const emailMsg = subject + ": " + message;

  const filter = new Filter();

  const isProfane = filter.isProfane(emailMsg);
  if (isProfane) {
    throw new Error("Email sent failed. It might contains profane words.");
  }
  console.log(emailMsg);
  try {
    const msg = {
      to,
      subject,
      text: message,
      from: "caiomiranda701@gmail.com",
    };

    await sgMail.send(msg);

    await EmailMessage.create({
      sentBy: req?.user?._id,
      from: req?.user?.email,
      to,
      message,
      subject,
    });
    res.json("Mail sent");
  } catch (error) {
    res.json(error);
  }
});

module.exports = { sendEmailMessageController };
