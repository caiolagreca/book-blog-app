const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");

const app = express();
//DB
dbConnect();

//Middleware
app.use(express.json());

//Users route
app.use("/api/users", userRoutes);

//err handler
app.use(notFound);
app.use(errorHandler);

//SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server is running on port ${PORT}`));

// PASSWORD: 9zqZvwERriNeiEwB