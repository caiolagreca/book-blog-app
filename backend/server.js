const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const postRoute = require("./route/posts/postRoute");
const commentRoute = require("./route/comments/commentRoute");
const emailMessageRoute = require("./route/emailMessages/emailMessageRoute");
const categoryRoute = require("./route/categories/categoryRoute");

const app = express();
//DB
dbConnect();

//Middleware
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/email", emailMessageRoute);
app.use("/api/category", categoryRoute);

//err handler
app.use(notFound);
app.use(errorHandler);

//SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is running on port ${PORT}`));

// PASSWORD: 9zqZvwERriNeiEwB
