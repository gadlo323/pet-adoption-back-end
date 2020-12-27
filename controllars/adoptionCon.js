const fs = require("fs");
const bcrypt = require("bcrypt");
const users = require("../models/userModel");
const pets = require("../models/petsModel");
const { createToken, verifyToken, isAdmin } = require("../utils/auth");

const sign_up = async (req, res, next) => {
  try {
    // Check if this user already exisits
    const userExsicte = await users.findOne({ email: req.body.email });
    if (userExsicte) {
      return res.status(400).send("That email is already in use!");
    }
    const hashePassword = await bcrypt.hash(req.body.password, 10);
    let newUser = new users();
    newUser.role = "1";
    newUser.first_name = req.body.firstName;
    newUser.last_name = req.body.lastName;
    newUser.email = req.body.email;
    newUser.phone = req.body.phone;
    newUser.password = hashePassword;
    newUser.save((err, savadata) => {
      if (err) res.status(500).send("oops input was wrong!");
      else {
        const toketPayload = {
          uId: savadata._id,
          role: savadata.role,
          name: savadata.first_name + " " + savadata.last_name,
        };
        const token = createToken(toketPayload);
        res.send(token);
      }
    });
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const sign_in = async (req, res) => {
  const { email, password } = req.body;
  users.findOne({ email: email }, async (err, userFound) => {
    if (err) return res.status(400).send("Password or Email are incorrect !");
    if (!userFound) {
      return res.status(400).send("The username does not exist");
    }
    if (!bcrypt.compareSync(password, userFound.password)) {
      return res
        .status(400)
        .send({ message: "Password or Email are incorrect !" });
    }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const tokenPayload = {
        uId: userFound._id,
        name: userFound.first_name + " " + userFound.last_name,
        role: userFound.role,
      };
      const newToken = createToken(tokenPayload);
      return res.send(newToken);
    } else {
      const verifyUid = await verifyToken(token);
      // validate user who she/he claims to be
      if (userFound._id !== verifyUid)
        return res.status(403).send({ error: "wrong credentials" });
    }
    return res.send(userFound);
  });
};

const token_valid = async (req, res) => {
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
};

const user_update = async (req, res) => {
  //cheack the algo after 2 submit of email exsicte is return error
  const { id } = req.params;
  const updateUser = req.body;
  let exsicte = false;
  if (updateUser.email) {
    await users.findOne({ email: updateUser.email }, (err, userExsicte) => {
      if (err)
        res
          .status(500)
          .send(
            "Oops There seems to be a server problem! Please try again later. "
          );
      if (userExsicte) {
        exsicte = true;
        return res.status(400).send("That email is already in use!");
      }
    });
  }
  if (!exsicte) {
    users.findOneAndUpdate(
      { _id: id },
      updateUser,
      { useFindAndModify: false },
      (err, data) => {
        if (err)
          res
            .status(400)
            .send(
              "There seems to be a problem.The update was not successful.Please try again later."
            );
        res.json(true);
      }
    );
  }
};

const get_user = (req, res) => {
  const { id } = req.params;
  users.findOne({ _id: id }, (err, data) => {
    if (err)
      return res
        .status(500)
        .send(
          "Oops There seems to be a server problem! Please try again later. "
        );
    else {
      res.json(data);
    }
  });
};
const add_pet = (req, res) => {
  const { filename } = req.file;
  let petData = JSON.parse(req.body.data);
  const hypoallergenic = petData.hypoallergenic == "true";
  console.log(hypoallergenic);
  try {
    const newpet = new pets({
      type: petData.type,
      name: petData.name,
      hypoallergenic: true,
      status: petData.status ? petData.status : "Available",
      height: +petData.height,
      weight: +petData.weight,
      breed: petData.breed,
      color: petData.color,
      dietary: petData.dietary,
      bio: petData.type,
      image_name: filename,
    });
    console.log(newpet);
    newpet.save((err, saveData) => {
      if (err) return res.status(500).send(err.message);
      else return res.send(true);
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  sign_up,
  sign_in,
  add_pet,
  token_valid,
  user_update,
  get_user,
};
