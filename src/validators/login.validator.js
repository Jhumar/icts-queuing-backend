const Joi = require('joi');

const schema = Joi.object({
  employee_id: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = schema;