const Joi = require("joi");

const signIn = Joi.object({
  password: Joi.string()
    .regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required()
    .messages({
      "string.regex": `invaild password`,
      "string.ref": `password do not match`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is a required field`,
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.empty": `email cannot be an empty field`,
      "any.required": `email is a required field`,
    }),
});

const signUp = Joi.object({
  firstName: Joi.string()
    .regex(RegExp(/^[a-zA-Z]+$/))
    .max(12)
    .min(2)
    .required()
    .messages({
      "string.base": `"first Name" should be a type of 'text'`,
      "string.empty": `"first Name" cannot be an empty field`,
      "string.min": `"first Name" should have a minimum length of 2`,
      "string.max": `"first Name" should have a maximum length of 12`,
      "any.required": `"first Name" is a required field`,
    }),
  lastName: Joi.string()
    .regex(RegExp(/^[a-zA-Z]+$/))
    .max(12)
    .min(2)
    .required()
    .messages({
      "string.base": `"last Name" should be a type of 'text'`,
      "string.empty": `"last Name" cannot be an empty field`,
      "string.min": `"last Name" should have a minimum length of 2`,
      "string.max": `"last Name" should have a maximum length of 12`,
      "any.required": `"last Name" is a required field`,
    }),

  phone: Joi.string()
    .regex(RegExp(/^((\+|00)\-?972?|0)(([23489]|[57]\d)\-?\d{7})$/))
    .required()
    .messages({
      "string.regex": `only israeli phone number`,
      "string.empty": `phone cannot be an empty field`,
      "any.required": `phone is a required field`,
    }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.empty": `email cannot be an empty field`,
      "any.required": `email is a required field`,
    }),

  password: Joi.string()
    .regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required()
    .messages({
      "string.regex": `invaild password`,
      "string.ref": `password do not match`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is a required field`,
    }),
  repatePass: Joi.ref("password"),
});

const updateUser = Joi.object({
  first_name: Joi.string()
    .regex(RegExp(/^[a-zA-Z]+$/))
    .max(12)
    .min(2)
    .messages({
      "string.base": `"first Name" should be a type of 'text'`,
      "string.empty": `"first Name" cannot be an empty field`,
      "string.min": `"first Name" should have a minimum length of 2`,
      "string.max": `"first Name" should have a maximum length of 12`,
      "any.required": `"first Name" is a required field`,
    }),
  last_name: Joi.string()
    .regex(RegExp(/^[a-zA-Z]+$/))
    .max(12)
    .min(2)
    .messages({
      "string.base": `"last Name" should be a type of 'text'`,
      "string.empty": `"last Name" cannot be an empty field`,
      "string.min": `"last Name" should have a minimum length of 2`,
      "string.max": `"last Name" should have a maximum length of 12`,
      "any.required": `"last Name" is a required field`,
    }),

  phone: Joi.string()
    .regex(RegExp(/^((\+|00)\-?972?|0)(([23489]|[57]\d)\-?\d{7})$/))
    .messages({
      "string.regex": `only israeli phone number`,
      "string.empty": `phone cannot be an empty field`,
      "any.required": `phone is a required field`,
    }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.empty": `email cannot be an empty field`,
      "any.required": `email is a required field`,
    }),

  password: Joi.string()
    .regex(RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .messages({
      "string.regex": `invaild password`,
      "string.ref": `password do not match`,
      "string.empty": `password cannot be an empty field`,
      "any.required": `password is a required field`,
    }),
  bio: Joi.string().max(120).min(5).messages({
    "string.empty": `bio cannot be an empty field`,
    "string.min": `"bio" should have a minimum length of 2`,
    "string.max": `"bio" should have a maximum length of 12`,
    "any.required": `bio is a required field`,
  }),
});

const addPet = Joi.object({
  type: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z]+$/))
    .required()
    .messages({
      "string.empty": `type cannot be an empty field`,
      "string.min": `"type" should have a minimum length of 2`,
      "string.max": `"type" should have a maximum length of 12`,
      "any.required": `type is a required field`,
    }),
  name: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z]+$/))
    .required()
    .messages({
      "string.empty": `name cannot be an empty field`,
      "string.min": `"name" should have a minimum length of 2`,
      "string.max": `"name" should have a maximum length of 12`,
      "any.required": `name is a required field`,
    }),
  status: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z]+$/))
    .required()
    .messages({
      "string.empty": `status cannot be an empty field`,
      "string.min": `"status" should have a minimum length of 2`,
      "string.max": `"status" should have a maximum length of 12`,
      "any.required": `status is a required field`,
    }),
  hypoallergenic: Joi.string()
    .regex(RegExp(/^[a-zA-Z]+$/))
    .required()
    .messages({
      "string.empty": `hypoallergenic cannot be an empty field`,
      "string.min": `"hypoallergenic" should have a minimum length of 4`,
      "string.max": `"hypoallergenic" should have a maximum length of 4`,
      "any.required": `"hypoallergenic" is a required field`,
    }),
  height: Joi.number().max(400).min(10).required().messages({
    "string.empty": `height cannot be an empty field`,
    "string.min": `"type" should have a minimum length of 10`,
    "string.max": `"type" should have a maximum length of 400`,
    "any.required": `type is a required field`,
  }),
  weight: Joi.string().max(300).min(0).required().messages({
    "string.empty": `weight cannot be an empty field`,
    "string.max": `"weight" should have a maximum length of 300`,
    "string.min": `"weight" should have a maximum length of 0`,
    "any.required": `weight is a required field`,
  }),
  breed: Joi.string()
    .max(20)
    .min(2)
    .regex(RegExp(/^[a-zA-Z\s]+$/))
    .required()
    .messages({
      "string.empty": `breed cannot be an empty field`,
      "string.min": `"breed" should have a minimum length of 2`,
      "string.max": `"breed" should have a maximum length of 20`,
      "any.required": `breed is a required field`,
    }),
  color: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z\s]+$/))
    .required()
    .messages({
      "string.empty": `color cannot be an empty field`,
      "string.min": `"color" should have a minimum length of 2`,
      "string.max": `"color" should have a maximum length of 12`,
      "any.required": `color is a required field`,
    }),
  dietary: Joi.string()
    .max(200)
    .min(2)
    .regex(RegExp(/^[a-zA-Z\s]+$/))
    .required()
    .messages({
      "string.empty": `dietary cannot be an empty field`,
      "string.min": `"dietary" should have a minimum length of 2`,
      "string.max": `"dietary" should have a maximum length of 100`,
      "any.required": `dietary is a required field`,
    }),
  bio: Joi.string()
    .max(140)
    .min(2)
    .regex(RegExp(/^[a-zA-Z\s]+$/))
    .required()
    .messages({
      "string.empty": `bio cannot be an empty field`,
      "string.min": `"bio" should have a minimum length of 2`,
      "string.max": `"bio" should have a maximum length of 140`,
      "any.required": `bio is a required field`,
    }),
});

const searchPet = Joi.object({
  type: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z\s]+$/))
    .messages({
      "string.min": `"type" should have a minimum length of 2`,
      "string.max": `"type" should have a maximum length of 12`,
    }),
  name: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z\s]+$/))
    .messages({
      "string.min": `"name" should have a minimum length of 2`,
      "string.max": `"name" should have a maximum length of 12`,
    }),
  status: Joi.string()
    .max(12)
    .min(2)
    .regex(RegExp(/^[a-zA-Z]+$/))
    .messages({
      "string.min": `"status" should have a minimum length of 2`,
      "string.max": `"status" should have a maximum length of 12`,
    }),

  height: Joi.number().max(250).min(10).messages({
    "string.min": `"type" should have a minimum length of 10`,
    "string.max": `"type" should have a maximum length of 400`,
  }),
  weight: Joi.number().max(200).min(0).messages({
    "string.max": `"weight" should have a maximum length of 300`,
    "string.min": `"weight" should have a maximum length of 0`,
  }),
});

module.exports = {
  signIn,
  signUp,
  updateUser,
  addPet,
  searchPet,
};
