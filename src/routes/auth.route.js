const express = require('express');
const Router = express.Router();

const controller = require('../controllers/auth.controller.js');
const { validateRequestHeaderToken } = require('../middlewares/jwt.middleware');

Router.post('/login', controller.login);
Router.get('/refresh-token', validateRequestHeaderToken, controller.refreshToken);

module.exports = Router;