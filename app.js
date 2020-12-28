const express = require("express");
require("dotenv").config();
const routes = require("./routes/petsRoutes");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 5000;
const mongo_url = `mongodb+srv://${process.env.MONGO_ADMIN_USER}:${process.env.MONGO_ADMIN_PASSWORD}@petsproject.grr82.mongodb.net/pets_adoption?retryWrites=true&w=majority`;

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
//static files(css,js)& middleware
app.use(express.static("./public"));
app.use(express.static("./pets-photos"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//fire router
app.use("/", routes);

app.listen(port, () => console.log(`listen in : http://localhost:${port}`));
