const { body, validationResult } = require("express-validator");

const validateUserSignup = [
  body("firstName").exists().isLength({ min: 2, max: 10 }),
  body("lastName").exists().isLength({ min: 2, max: 12 }),
  body("email").isEmail(),
  body("phone").matches(/^((\+|00)\-?972?|0)(([23489]|[57]\d)\-?\d{7})$/gm),
  body("password").matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  ),
  body("repeatPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

const validateUserLogin = [
  body("email").isEmail(),
  body("password")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    .withMessage("password is vaild"),
];

const validateUserUpdate = [
  body("email").isEmail(),
  body("password").matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  ),
  body("firstName").isLength({ min: 2, max: 10 }),
  body("lastName").isLength({ min: 2, max: 12 }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.errors.length) {
    next();
  } else {
    res.status(400).send({ errors });
  }
};

module.exports = {
  validateUserSignup,
  handleValidationErrors,
  validateUserLogin,
  validateUserUpdate,
};
