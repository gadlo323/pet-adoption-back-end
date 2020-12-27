require("dotenv").config();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const createToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
};

const verifyToken = async (token) => {
  try {
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return payload.uId;
  } catch (err) {
    return null;
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = await verifyToken(token);
  if (!user) res.status(403).send("Error, Forbidden");
  fs.readFile("./users.json", "utf8", async function read(err, data) {
    if (err) {
      throw err;
    }
    const allUsers = await JSON.parse(data);
    const userObj = userInfo(user, allUsers);
    if (userObj.role == process.env.ADMIN_STATUS) {
      next();
    } else {
      res.status(403).send("Error, Forbidden");
    }
  });
};

const userInfo = (userId, data) => {
  const user = data.filter((item) => {
    return item.uId == userId;
  });
  return user[0];
};

module.exports = { createToken, verifyToken, isAdmin };
