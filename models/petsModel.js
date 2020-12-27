const mongoose = require("mongoose");

const pet_schema = new mongoose.Schema({
  role: String,
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
  hphohypoallergenicne: {
    type: Boolean,
    // default: false,
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
});

const Pets = mongoose.model("pets", pet_schema);

module.exports = Pets;
