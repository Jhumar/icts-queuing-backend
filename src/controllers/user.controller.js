const { Request, Response } = require('express');
const knex = require('../utils/knex.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const ApiClientError = require('../errors/ApiClientError');

/**
 * Route for creating user
 * 
 * @param {Request} req
 * @param {Response} res
 * @throws {ApiClienteError}
 * @returns {Response}
 */
exports.create = async (req, res, next) => {
  try {
    // Validate the values from req.body using Joi Schema Validator
    const validator = require('../validators/user.validator');
    await validator.validateAsync(req.body);

    const {
      first_name,
      last_name,
      sex,
      employee_id,
      institutional_email,
      role
    } = req.body;

    const [isUserExists] = await knex.select('*')
      .table('users')
      .where({
        employee_id
      })
      .orWhere({
        institutional_email
      });

    if (isUserExists) {
      throw new ApiClientError('Employee ID or Institutional Email is already exists.', 400);
    }

    const hashed_password = bcrypt.hashSync(employee_id, 12);

    const userObject = {
      uuid: uuidv4(),
      first_name,
      last_name,
      sex,
      employee_id,
      institutional_email,
      password: hashed_password,
      role
    };

    await knex.table('users').insert(userObject);

    delete userObject.password;

    res.json({
      message: 'Successfully created a new user',
      sub: userObject
    });
  }
  catch(err) {
    next(err);
  }
};

/**
 * Route for reading user
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
exports.read = async (req, res, next) => {
  try {
    const q = `%${req.query.q || ''}%`;

    const users = await knex.select(['uuid', 'first_name', 'last_name', 'sex', 'employee_id', 'institutional_email', 'role', 'status'])
      .table('users')
      .whereILike('first_name', q)
      .orWhereILike('last_name', q)
      .orWhereILike('sex', q)
      .orWhereILike('employee_id', q)
      .orWhereILike('institutional_email', q)
      .orWhereILike('role', q)
      .orWhereILike('status', q);

    res.json({
      message: 'Successfully retrieved users.',
      sub: users
    });
  }
  catch(err) {
    console.log(err.message);
    next(err);
  }
};

/**
 * Route for reading one user
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
exports.readOne = async (req, res, next) => {
  try {
    const {
      id = null
    } = req.params;

    if (id === null) {
      throw new ApiClientError('Id should not be empty.', 400);
    }

    const [user] = await knex.select(['uuid', 'first_name', 'last_name', 'sex', 'employee_id', 'institutional_email', 'role', 'status'])
      .table('users')
      .where('uuid', id);

    if (!user) {
      throw new ApiClientError('User does not exists.', 404);
    }

    res.json({
      message: 'Successfully retrieved a user.',
      sub: user
    });
  }
  catch(err) {
    console.log(err.message);
    next(err);
  }
};

/**
 * Route for updating user
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
exports.update = async (req, res, next) => {
  try {
    // Validate the values from req.body using Joi Schema Validator
    const validator = require('../validators/user.validator');
    await validator.validateAsync(req.body);

    const {
      first_name,
      last_name,
      sex,
      employee_id,
      institutional_email,
      role
    } = req.body;

    const {
      id
    } = req.params;

    const [isUserExists] = await knex.select('*')
      .table('users')
      .where({
        employee_id
      })
      .andWhere({
        institutional_email
      })
      .whereNot({
        uuid: id
      });

    if (isUserExists) {
      throw new ApiClientError('Employee ID or Institutional Email is already exists.', 400);
    }

    const userObject = {
      first_name,
      last_name,
      sex,
      employee_id,
      institutional_email,
      role
    };

    await knex('users')
      .where('uuid', id)
      .update(userObject);

    res.json({
      message: 'Successfully updated a user.',
      sub: {
        uuid: id,
        ...userObject,
      }
    });
  }
  catch(err) {
    console.log(err.message);
    next(err);
  }
};

/**
 * Route for delete user
 * 
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [isUserExists] = await knex.select('*')
      .table('users')
      .where({
        uuid: id
      });

    if (!isUserExists) {
      throw new ApiClientError('User does not exists.', 404);
    }

    await knex('users')
      .where('uuid', id)
      .del();

    res.json({
      message: 'Successfully deleted a user.',
      sub: null
    });
  }
  catch(err) {
    console.log(err.message);
    next(err);
  }
};