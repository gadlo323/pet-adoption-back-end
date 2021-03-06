const express = require("express");
require("dotenv").config();
const petsRoutes = require("./routes/petsRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
const mongo_url = process.env.MONGO_CONNECT;

mongoose
  .connect(
    mongo_url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    { useFindAndModify: true },
    { useCreateIndex: false }
  )
  .then(() => {
    console.log("Connection to the db is successful!");
  })
  .catch((err) => console.error(err));

// ENABLING COR REQUESTS
const origins = [
  "http://localhost:5000", // Production Build
  "https://adoptfriend.herokuapp.com",
  "https://adoptefriend.netlify.app",
];
//static files& middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());

//fire router
app.use("/", petsRoutes);
app.use("/", userRoutes);

<<<<<<< HEAD:server.js
app.listen(port, () => console.log(`listen in port: ${port}`));
=======
app.listen(process.env.PORT || 5000, () =>
  console.log(`listen in port:${port}`)
);
>>>>>>> 2af1864c1c356f320704995f8c75f1530912ede3:app.js
