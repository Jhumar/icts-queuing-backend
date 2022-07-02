const {Request, Response} = require('express');
const jwt = require('jsonwebtoken');
const { TokenExpiredError } = require("jsonwebtoken");
const ApiClientError = require('../errors/ApiClientError');
const { SECRET } = require('../config.js');

/**
 * Middleware for validating jwt in headers
 * 
 * @param {Request} req
 * @param {Response} res
 * @throws {ApiClientError}
 */
exports.validateRequestHeaderToken = async (req, res, next) => {
  try {
    const accessToken = req.header('Access-Token');
    const refreshToken = req.header('Refresh-Token');

    if (!accessToken) {
      throw new ApiClientError('AccessToken is missing in request header.', 400);
    }

    if (!refreshToken) {
      throw new ApiClientError('RefreshToken is missing in request header.', 400);
    }

    jwt.verify(refreshToken, SECRET, { algorithms: ['HS256'] }, function(err, payload) {
      if (err && !(err instanceof TokenExpiredError)) {
        throw new ApiClientError('RefreshToken is malformed.', 400);
      }
    });

    jwt.verify(accessToken, SECRET, { algorithms: ['HS256'] }, function(err, payload) {
      if (err) {
        throw new ApiClientError('AccessToken is either malformed or expired.', 400);
      }

      req.user = payload;
      next();
    });
  }
  catch(err) {
    next(err);
  }
};