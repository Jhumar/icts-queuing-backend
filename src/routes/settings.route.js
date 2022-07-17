const express = require("express");
const Router = express.Router();

const controller = require("../controllers/settings.controller");

Router.get("/settings", controller.read);
Router.patch("/settings", controller.update);

module.exports = Router;
