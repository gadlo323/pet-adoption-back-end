require("dotenv").config();
const users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const maxAge = 1000;

const createToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

const verifyToken = async (token) => {
  return await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return false;
      } else {
        return decoded.uId;
      }
    }
  );
};

const isAdmin = async (req, res, next) => {
  const { token } = req.cookies;
  const userId = await verifyToken(token);

  if (!userId) res.status(403).send("Error, Forbidden");
  const userObj = await userInfo(userId);
  if (userObj.role == process.env.ADMIN_STATUS) {
    next();
  } else {
    res.status(403).send("Error, Forbidden");
  }
};

const userInfo = async (userId) => {
  return await users.findOne({ _id: userId }, (err, data) => {
    if (err)
      return res
        .status(500)
        .send(
          "Oops There seems to be a server problem! Please try again later. "
        );
    else {
      return data;
    }
  });
};

module.exports = { createToken, verifyToken, isAdmin, maxAge };
