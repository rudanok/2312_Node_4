const Joi = require('joi');

// Схема валидации данных пользователя
const userSchema = Joi.object({
//   id: Joi.number().integer().min(1).required(),
  firstName: Joi.string().required(),
  secondName: Joi.string().required(),
  age: Joi.number().integer().min(1).required(),
  city: Joi.string().required(),
});

module.exports = userSchema;
