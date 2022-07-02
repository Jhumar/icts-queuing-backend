const { Request, Response } = require('express');
const knex = require('../utils/knex.js');
const { v4: uuidv4 } = require('uuid');
const ApiClientError = require('../errors/ApiClientError');

/**
 * Route for creating window
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @throws {ApiClientError}
 * @returns {Response}
 */
exports.create = async (req, res, next) => {
  try {
    // Validate the values from req.body using Joi Schema Validator
    const validator = require('../validators/window.validator');
    await validator.validateAsync(req.body);

    const {
      name,
      department,
      teller_id,
      type
    } = req.body;

    const [isWindowExists] = await knex.select('*')
      .table('windows')
      .where({
        name,
        department
      });

    if (isWindowExists) {
      throw new ApiClientError(`Window ${name} is already exists in ${department} department.`, 400);
    }

    const [teller] = await knex.select('*')
      .table('windows')
      .where({
        teller_id
      })
      .limit(1);

    if (teller) {
      throw new ApiClientError(`This teller is already assigned to ${teller.name}.`, 400);
    }

    const [window] = await knex.table('windows').insert({
      uuid: uuidv4(),
      name,
      department,
      teller_id,
      type
    });

    res.json({
      message: 'Successfully created a new window.',
      sub: window
    });
  }
  catch(err) {
    next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const {
      q = '',
      type = null,
      with_teller = false
    } = req.query;

    const windows = await knex.select('*')
      .table('windows')
      .whereRaw(`${type ? `type = '${type}'${q.length > 0 ? ` OR name LIKE '%${q}%'` : ''}` : `name LIKE '%${q}%'`}`)

    if (with_teller) {
      for (let i = 0; i < windows.length; i++) {
        const window = windows[i];

        const [teller] = await knex.select('*')
          .from('users')
          .where({ uuid: window.teller_id })

        window.teller = teller;
      }
    }

    res.json({
      message: 'Successfully retrieved windows.',
      sub: windows
    });
  }
  catch(err) {
    next(err);
  }
};

exports.readOne = async (req, res, next) => {
  try {
    const {
      id = null
    } = req.params;

    if (id === null) {
      throw new ApiClientError('Id should not be empty.', 400);
    }

    const [window] = await knex.select('*')
      .table('windows')
      .where('uuid', id);

    if (!window) {
      throw new ApiClientError('Windows does not exists.', 404);
    }

    const [teller] = await knex.select('*')
      .from('users')
      .where({ uuid: window.teller_id })

    window.teller = teller;

    res.json({
      message: 'Successfully retrieved a user.',
      sub: window
    });
  }
  catch(err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    // Validate the values from req.body using Joi Schema Validator
    const validator = require('../validators/window.validator');
    await validator.validateAsync(req.body);

    const {
      name,
      department,
      teller_id,
      type
    } = req.body;

    const {
      id
    } = req.params;

    const [isWindowExists] = await knex.select('*')
      .table('windows')
      .where({
        name,
        department
      })
      .whereNot({
        uuid: id
      });

    if (isWindowExists) {
      throw new ApiClientError(`Window ${name} is already exists in ${department} department.`, 400);
    }

    const [teller] = await knex.select('*')
      .table('windows')
      .where({
        teller_id
      })
      .whereNot({
        uuid: id
      })
      .limit(1);

    if (teller) {
      throw new ApiClientError(`This teller is already assigned to ${teller.name}.`, 400);
    }

    await knex('windows')
      .where('uuid', id)
      .update({
        name,
        department,
        teller_id,
        type
      });

    res.json({
      message: 'Successfully updated a window.',
      sub: {
        uuid: id,
        ...req.body
      }
    });
  }
  catch(err) {
    next(err);
  }
};

exports._delete = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;

    const [isWindowExists] = await knex.select('*')
      .table('windows')
      .where({
        uuid: id
      });

    if (!isWindowExists) {
      throw new ApiClientError('Window does not exists.', 404);
    }

    await knex('windows')
      .where('uuid', id)
      .del();

    await knex('queues')
      .where('window_id', id)
      .del();

    res.json({
      message: 'Successfully deleted a window.',
      sub: null
    });
  }
  catch(err) {
    next(err);
  }
};