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
app.post("/signup", validateUserSignup, handleValidationErrors, (req, res) => {
  users.push(req.body);
  fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
  res.send(req.body);
});

app.post("/login", validateUserLogin, handleValidationErrors, (req, res) => {
  const { email, password } = req.body;

  fs.readFile("./users.json", "utf8", function read(err, data) {
    if (err) {
      throw err;
    }
    const exists = logUser(JSON.parse(data), email, password);
    if (exists) {
      res.send(exists);
    } else res.send(null);
  });
});

app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;
  const newUserList = users.map((user) => {
    return user.uId == id ? { ...user, ...updateUser } : user;
  });
  fs.writeFileSync("./users.json", JSON.stringify(newUserList, null, 2));
  res.json(newUserList);
});

const logUser = (data, email, password) => {
  const user = data.filter((item) => {
    return item.email === email && item.password === password;
  });
  return user.length ? user : "";
};

//fire routes
// app.use("/adoption", adoptionRoutes);

app.listen(port, () => console.log(`listen in : http://localhost:${port}`));
