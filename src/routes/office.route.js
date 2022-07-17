const express = require("express");
const Router = express.Router();

const controller = require("../controllers/office.controller");

Router.get("/office", controller.read);
Router.post("/office", controller.create);
Router.delete("/office/:id", controller._delete);

module.exports = Router;
