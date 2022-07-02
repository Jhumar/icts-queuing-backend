const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  department: Joi.string().allow(null).required(),
  teller_id: Joi.string().allow(null).optional(),
  type: Joi.string().required()
});

module.exports = schema;