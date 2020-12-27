const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const app = express();
const cors = require("cors");
const { createToken, verifyToken, isAdmin } = require("./utils/auth");
const port = 5000;
const {
  validateUserSignup,
  handleValidationErrors,
  validateUserLogin,
} = require("./userValid");

let users = require("./users.json");
let pets = require("./list_pets.json");
const { json } = require("body-parser");
//static files(css,js)& middleware
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const storage = multer.diskStorage({
  destination: "./pets-photos",
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname} - ${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.post(
  "/signup",
  validateUserSignup,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      // const salt = await bcrypt.genSalt();
      const hashePassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashePassword;
      const toketPayload = {
        uId: req.body.uId,
        role: "1",
        name: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
      };
      const token = createToken(toketPayload);
      /* need to check if email is alredy is exciste */
      users.push(req.body);
      fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
      res.send(token);
    } catch (err) {
      res.status(500).send();
    }
  }
);

app.post(
  "/login",
  validateUserLogin,
  handleValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;
    fs.readFile("./users.json", "utf8", async function read(err, data) {
      if (err) {
        throw err;
      }
      const exists = await logUser(JSON.parse(data), email, password);
      if (exists) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        //work but strange!
        if (token) {
          const tokenPayload = {
            uId: exists.uId,
            name: exists.firstName + " " + exists.lastName,
            email: exists.email,
            role: exists.role,
          };
          const newToken = createToken(tokenPayload);
          res.send(newToken);
        } else {
          const verifyUid = await verifyToken(token);
          if (exists.uId !== verifyUid) {
            // validate user who she/he claims to be
            return res.status(403).send({ error: "wrong credentials" });
          }
          res.send(exists);
        }
      } else res.status(400).send(null);
    });
  }
);

app.post("/addpet", isAdmin, upload.single("petImage"), (req, res) => {
  const { filename } = req.file;
  let petData = JSON.parse(req.body.data);
  petData["image"] = filename;
  try {
    pets.push(petData);
    fs.writeFileSync("./list_pets.json", JSON.stringify(pets, null, 2));
    res.send(true);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/user/tokenValid", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).send(false);
  }

  const userVerify = await verifyToken(token);
  if (!userVerify) {
    return res.status(403).send(false);
  }

  res.send(true);
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
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const userData = users.filter((user) => {
    return user.uId == id;
  });

  res.json(userData[0]);
});

const logUser = async (data, email, password) => {
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].email === email &&
      (await bcrypt.compare(password, data[i].password))
    )
      return data[i];
  }

  return null;
};

app.listen(port, () => console.log(`listen in : http://localhost:${port}`));
