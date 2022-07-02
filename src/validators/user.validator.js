const Joi = require('joi');

const schema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  sex: Joi.string().required(),
  employee_id: Joi.string().required(),
  institutional_email: Joi.string().email().required(),
  role: Joi.string().required()
});

module.exports = schema;