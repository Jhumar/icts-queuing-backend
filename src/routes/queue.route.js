const express = require("express");
const Router = express.Router();

const controller = require("../controllers/queue.controller");
const { validateRequestHeaderToken } = require("../middlewares/jwt.middleware");

Router.post("/queue", controller.generate);
Router.get("/queue", controller.read);
Router.get("/queue/:id", controller.readSpecific);
Router.patch("/queue/:id", controller.updateSpecific);
Router.get("/queue/:id/history", controller.history);
Router.get("/queue/:id/history/window", controller.windowHistory);

module.exports = Router;
