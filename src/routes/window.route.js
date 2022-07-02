const express = require('express');
const Router = express.Router();

const controller = require('../controllers/window.controller');
const { validateRequestHeaderToken } = require('../middlewares/jwt.middleware');

Router.post('/window', validateRequestHeaderToken, controller.create);
Router.get('/window', controller.read);
Router.get('/window/:id', validateRequestHeaderToken, controller.readOne);
Router.patch('/window/:id', validateRequestHeaderToken, controller.update);
Router.delete('/window/:id', validateRequestHeaderToken, controller._delete);

module.exports = Router;