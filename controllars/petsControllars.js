const pets = require("../models/petsModel");
const cloudinary = require("../utils/cloudinary");
const { addPet } = require("../utils/validations");

const add_pet = async (req, res) => {
  const { originalname, path } = req.file;
  let petData = JSON.parse(req.body.data);
  const { error } = addPet.validate(petData);
  if (error) return res.status(400).send(error.details[0].message);
  const hypoallergenic = petData.hypoallergenic == "true";
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(path, {
      folder: "pets_project",
      use_filename: true,
    });
    const newpet = new pets({
      type: petData.type,
      name: petData.name,
      hypoallergenic: hypoallergenic,
      status: petData.status ? petData.status : "Available",
      height: +petData.height,
      weight: +petData.weight,
      breed: petData.breed,
      color: petData.color,
      dietary: petData.dietary,
      bio: petData.bio,
      image_url: result.secure_url,
      image_name: originalname,
      cloudinary_id: result.public_id,
    });
    newpet.save((err, saveData) => {
      if (err) return res.status(500).send(err.message);
      else return res.send(true);
    });
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const get_pet = (req, res) => {
  try {
    const { id } = req.params;
    pets.findOne({ _id: id }, (err, data) => {
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
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

const search = (req, res) => {
  try {
    pets.find(
      {
        $and: [req.body],
      },
      "name status type height weight image_url image_name",
      (err, data) => {
        if (err) res.status(400).send(`no type of ${query} is avilable`);
        res.json(data);
      }
    );
  } catch (err) {
    res
      .status(500)
      .send("There seems to be a server problem! Please try again later.");
  }
};

module.exports = {
  add_pet,
  get_pet,
  search,
};