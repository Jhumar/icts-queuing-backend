const { Request, Response } = require('express');
const bcrypt = require('bcrypt');
const knex = require('../utils/knex.js');
const ApiClientError = require('../errors/ApiClientError.js');
const { sign } = require('../utils/jwt.js');

/**
 * Controller for /login route
 * 
 * @param {Request} req
 * @param {Response} req
 * @throws {ApiClientError}
 * @returns {Response}
 */
exports.login = async (req, res, next) => {
  try {
    // Validate the values from req.body using Joi Schema Validator
    const validator = require('../validators/login.validator.js');
    await validator.validateAsync(req.body);

    const { employee_id, password } = req.body;

    const [user] = await knex.select('*')
      .table('users')
      .where({
        employee_id
      });

    // Check if there are user found in the database
    if (!user) {
      throw new ApiClientError('Invalid username or password.', 401);
    }

    // Check if the passwords are matched
    if (!bcrypt.compareSync(password, user.password)) {
      throw new ApiClientError('Invalid username or password.', 401);
    }

    const [window] = await knex.select('*')
      .table('windows')
      .where({
        teller_id: user.uuid
      });

    delete user.password;

    const { access_token, refresh_token } = sign(user);

    res.json({
      user: {
        ...user,
        window
      },
      credentials: {
        access_token,
        refresh_token,
      }
    });
  }
  catch(err) {
    next(err);
  }
};

/**
 * Route for refresh token
 * 
 * @param {Request} req
 * @param {Response} res
 * @throws {ApiClientError}
 * @returns {Response}
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const [user] = await knex.select('*')
      .table('users')
      .where({
        employee_id: req.user.employee_id
      });

    delete user.password;

    const [window] = await knex.select('*')
      .table('windows')
      .where({
        teller_id: user.uuid
      });

    delete user.password;

    const { access_token, refresh_token } = sign(user);

    res.json({
      user: {
        ...user,
        window
      },
      credentials: {
        access_token,
        refresh_token,
      }
    });
  }
  catch(err) {
    next(err);
  }
};