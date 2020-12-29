const mongoose = require("mongoose");

const pet_schema = new mongoose.Schema({
  type: {
    type: String,
    required: "Please supply an  type",
  },
  name: {
    type: String,
    required: "Please supply an  name",
  },
  status: {
    type: String,
    required: "Please supply an status",
  },
  hypoallergenic: {
    type: Boolean,
    default: false,
    required: "Please supply an hypoallergenic",
  },
  height: {
    type: Number,
    required: "Please supply height",
  },
  weight: {
    type: Number,
    required: "Please supply weight",
  },
  breed: {
    type: String,
    required: "Please supply breed",
  },
  color: {
    type: String,
    required: "Please supply color",
  },
  dietary: {
    type: String,
    required: "Please supply dietary",
  },
  bio: {
    type: String,
  },
  image_name: {
    type: String,
  },
  image_url: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});

const Pets = mongoose.model("pets", pet_schema);

module.exports = Pets;
