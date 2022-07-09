const express = require("express");
const fileUpload = require('express-fileupload');
const Router = express.Router();

const controller = require('../controllers/media.controller');
const { validateRequestHeaderToken } = require("../middlewares/jwt.middleware");

const fileHandler = fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: true
});

Router.post('/media', fileHandler, controller.create);

module.exports = Router;