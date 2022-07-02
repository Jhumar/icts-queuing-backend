const express = require('express');
const Router = express.Router();

const controller = require('../controllers/user.controller');
const { validateRequestHeaderToken } = require('../middlewares/jwt.middleware');

Router.post('/user', validateRequestHeaderToken, controller.create);
Router.get('/user', validateRequestHeaderToken, controller.read);
Router.get('/user/:id', validateRequestHeaderToken, controller.readOne);
Router.patch('/user/:id', validateRequestHeaderToken, controller.update);
Router.delete('/user/:id', validateRequestHeaderToken, controller.delete);

module.exports = Router;