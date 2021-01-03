const bcrypt = require("bcrypt");
const users = require("../models/userModel");
const pets = require("../models/petsModel");
const { signIn, signUp, updateUser } = require("../utils/validations");
const { createToken, verifyToken } = require("../utils/auth");

const sign_up = async (req, res, next) => {
  try {
    const { error } = signUp.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
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
  const { error } = signIn.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
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
  try {
    const { id } = req.params;
    const data = req.body;
    const { error } = updateUser.validate(data);
    if (error) return res.status(400).send(error.details[0].message);
    //cheack the algo after 2 submit of email exsicte is return error

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
        data,
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
  } catch (err) {
    res.status(500).send("oops server shot dwon");
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

const adopet_foster = (req, res) => {
  // ToDo : save the pet id only no the all object
  const { id } = req.params;
  const petId = req.body.data._id;
  const type = req.body.type;
  try {
    users.findOneAndUpdate(
      { _id: id },
      { $push: { adopted: petId } },
      { useFindAndModify: false },
      async (err, data) => {
        if (err) res.status(400).send(err);
        const success = await updatePetStatus(petId, type);
        if (success) {
          res.send(success);
        }
      }
    );
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const save_pet = (req, res) => {
  const { id } = req.params;
  try {
    users.findOneAndUpdate(
      { _id: id },
      { $push: { saved: req.body._id } },
      { useFindAndModify: false },
      async (err, data) => {
        if (err) res.status(400).send(err);
        if (data) {
          res.send(true);
        }
      }
    );
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const remove_save_pet = (req, res) => {
  const { uId, petid } = req.query;
  console.log(uId, petid);
  try {
    users.updateOne(
      { _id: uId },
      { $pullAll: { saved: [petid] } },
      async (err, data) => {
        if (err) res.status(400).send(err);
        if (data) res.send(true);
      }
    );
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const my_pets = (req, res) => {
  let savedPets = [];
  let ownedPets = [];
  try {
    const { id } = req.params;
    users.findOne({ _id: id }, "adopted saved", async (err, data) => {
      if (err)
        return res
          .status(500)
          .send(
            "Oops There seems to be a server problem! Please try again later. "
          );
      else {
        const result = await resolve_data(data);
        result.forEach((item) => {
          if (item.status === "Available") savedPets.push(item);
          else ownedPets.push(item);
        });
        res.json({ adopted: ownedPets, saved: savedPets });
      }
    });
  } catch (err) {
    res
      .status(500)
      .send(
        "There seems to be a server problem! Please try again later." + err
      );
  }
};

const return_pet = (req, res) => {
  const { uId, petid } = req.query;
  const type = "Available";
  try {
    users.updateOne(
      { _id: uId },
      { $pullAll: { adopted: [petid] } },
      async (err, data) => {
        if (err) res.status(400).send(err);
        const success = await updatePetStatus(petid, type);
        if (success) {
          res.send(success);
        }
      }
    );
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

//TODO: separate into another file
const updatePetStatus = (id, type) => {
  try {
    pets.findOneAndUpdate(
      { _id: id },
      { status: `${type}` },
      { useFindAndModify: false },
      (err, data) => {
        if (err)
          res
            .status(400)
            .send(
              "There seems to be a problem.The update was not successful.Please try again later."
            );
      }
    );
    return true;
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const resolve_data = async (data) => {
  const combainData = [...data.adopted, ...data.saved];
  try {
    const dbData = await pets.find({ _id: combainData }).exec();
    return dbData;
  } catch (err) {
    return err;
  }
};

module.exports = {
  sign_up,
  sign_in,
  token_valid,
  user_update,
  get_user,
  adopet_foster,
  save_pet,
  remove_save_pet,
  my_pets,
  return_pet,
};