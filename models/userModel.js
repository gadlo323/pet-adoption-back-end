const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  role: String,
  first_name: {
    type: String,
    required: "Please supply an  first name",
  },
  last_name: {
    type: String,
    required: "Please supply an  last name",
  },
  email: {
    type: String,
    unique: true,
    required: "Please supply an email",
  },
  phone: {
    type: String,
    required: "Please supply an phone number",
  },
  password: {
    type: String,
    required: "Please supply password",
  },
  bio: {
    type: String,
  },
});

const Users = mongoose.model("users", user_schema);

module.exports = Users;
