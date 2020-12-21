const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = 5000;
const {
  validateUserSignup,
  handleValidationErrors,
  validateUserLogin,
} = require("./userValid");
let users = require("./users.json");
const { json } = require("body-parser");
//static files(css,js)& middleware
app.use(express.static("./public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("dsd");
});
app.post(
  "/adoption/signup",
  validateUserSignup,
  handleValidationErrors,
  (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      repetPassword,
    } = req.body;

    users.push(req.body);
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
    res.send({
      email: email,
      name: firstName + " " + lastName,
    });
  }
);

app.post(
  "/adoption/login",
  validateUserLogin,
  handleValidationErrors,
  (req, res) => {
    const { email, password } = req.body;

    fs.readFile("./users.json", "utf8", function read(err, data) {
      if (err) {
        throw err;
      }
      const exists = logUser(JSON.parse(data), email, password);
      if (exists) {
        res.send({
          email: exists[0].email,
          name: exists[0].firstName + " " + exists[0].lastName,
        });
      } else res.send(null);
    });
  }
);

const logUser = (data, email, password) => {
  const user = data.filter((item) => {
    return item.email === email && item.password === password;
  });
  return user.length ? user : "";
};

//fire routes
// app.use("/adoption", adoptionRoutes);

app.listen(port, () => console.log(`listen in : http://localhost:${port}`));
