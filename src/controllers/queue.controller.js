const { Request, Response } = require('express');
const knex = require('../utils/knex.js');
const { v4: uuidv4 } = require('uuid');
const ApiClientError = require('../errors/ApiClientError');
const moment = require('moment');

const paddedNumber = (number) => {
  const padding = number.toString().length < 3 ? '0'.repeat(3 - number.toString().length) : '';

  return `${padding}${number}`;
}

/**
 * Route for creating queue
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @throws {ApiClientError}
 * @returns {Response}
 */
exports.generate = async (req, res, next) => {
  try {
    const {
      request = false
    } = req.query;

    const {
      window_id = null,
    } = req.body;

    if (!Boolean(window_id)) {
      throw new ApiClientError('Window is required.', 400);
    }

    const [window] = await knex.select('*')
      .table('windows')
      .where({ uuid: window_id });

    if (!window) {
      throw new ApiClientError('Window does not exists.', 404);
    }

    // Generate the queue number
    const [{count}] = await knex('queues').count('uuid', { as: 'count' })
      .whereRaw('DATE(created_at) = DATE(current_timestamp()) AND window_id = ?', [window_id]);

    const date = moment().format('YYYYMMDD');

    const windowInitials = window.name
      .split(' ')
      .map(chunk => chunk[0])
      .join('')
      .toUpperCase();

    const label = `${windowInitials}-${date}-${paddedNumber(count + 1)}`;
    const uuid = uuidv4();

    if (Boolean(request)) {
      return res.json({
        message: 'Successfully generated a queue number.',
        sub: {
          window_id,
          window_name: window.name,
          number: paddedNumber(count + 1),
          date: moment().format('MMMM DD, YYYY')
        }
      });
    }

    // Insert the queue to the database
    await knex.table('queues').insert({
      uuid,
      window_id,
      window_name: window.name,
      number: count + 1,
      label
    });

    const [queue] = await knex.select('*')
      .from('queues')
      .where({ uuid });

    res.json({
      message: 'Successfully generated a queue number.',
      sub: {
        ...queue,
        number: paddedNumber(queue.number),
        date: moment().format('MMMM DD, YYYY')
      }
    });
  }
  catch(err) {
    next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const {
      window_id = null,
      get_queues = false,
    } = req.query;

    let where = `DATE(created_at) = DATE(current_timestamp()) AND status = 'pending' ${Boolean(window_id) ? ` AND window_id = '${window_id}'` : ''}`;

    let queues = [];

    if (get_queues) {
      queues = await knex.select('*')
        .from('queues')
        .whereRaw(where)
        .orderBy(['window_name', 'number']);
    }
    else {
      const windows = await knex.distinct('window_id')
        .from('queues')
        .join('windows', 'queues.window_id', 'windows.uuid')
        .whereRaw(`queues.status = 'pending' AND DATE(queues.created_at) = DATE(current_timestamp())`)
        .orderBy('queues.window_name');

      if (windows.length > 0) {
        queues = await Promise.all(windows.map(async (w) => {
          const [queue] = await knex.select('*')
            .from('queues')
            .whereRaw(`
              DATE(created_at) = DATE(current_timestamp()) 
                AND status = 'pending' AND window_id = '${w.window_id}' 
                AND number = (
                  SELECT MIN(number) 
                  FROM queues 
                  WHERE DATE(created_at) = DATE(current_timestamp) 
                    AND status = 'pending' 
                    AND window_id = '${w.window_id}'
                )`);

          return queue;
        }));
        
      }
    }
    
    res.json({
      message: 'Successfully retrieved queues.',
      sub: queues.map(queue => ({
        ...queue,
        number: paddedNumber(queue.number)
      }))
    });
  }
  catch(err) {
    next(err);
  }
};

exports.readSpecific = async (req, res, next) => {
  try {
    const {
      id = null,
    } = req.params;

    let where = `DATE(created_at) = DATE(current_timestamp()) AND status = 'pending'`;

    if (Boolean(id)) {
      where += ` AND window_id = '${id}'`;
    }

    const queues = await knex.select('*')
      .from('queues')
      .whereRaw(where)
      .orderBy(['window_name', 'number']);

    res.json({
      message: 'Successfully retrieved queues.',
      sub: queues.map(queue => ({
        ...queue,
        number: paddedNumber(queue.number)
      }))
    });
  }
  catch(err) {
    next(err);
  }
};

exports.updateSpecific = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      time_elapsed
    } = req.body;

    const queues = await knex('queues')
      .where('uuid', id)
      .update({
        status: 'completed',
        time_elapsed
      });

    res.json({
      message: 'Successfully ended a queue.',
      sub: null
    });
  }
  catch(err) {
    next(err);
  }
}

exports.history = async (req, res, next) => {
  try {
    const {
      id
    } = req.params;

    const [window] = await knex.select('*')
      .table('windows')
      .where({
        teller_id: id
      });

    if (!window) {
      return res.json({
        message: 'Successfully retrieved user history.',
        sub: []
      });
    }

    const queues = await knex.select('*')
      .table('queues')
      .where({
        window_id: window.uuid,
        status: 'completed'
      })
      .orderBy('updated_at', 'DESC');

    res.json({
      message: 'Successfully retrieved user history.',
      sub: queues.map(q => {
        const endTime = moment(q.updated_at, 'YYYY-MM-DD HH:mm:ss');
        const startTime = moment(endTime).subtract(q.time_elapsed, 'seconds');

        q.number = paddedNumber(q.number);
        q.start_time = startTime.format('hh:mm:ss A');
        q.end_time = endTime.format('hh:mm:ss A');
        q.date = startTime.format('MMM DD, YYYY');

        return q;
      })
    });
  }
  catch(err) {
    next(err);
  }
};