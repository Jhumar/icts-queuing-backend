const express = require("express");
const fileUpload = require("express-fileupload");
const Router = express.Router();

const controller = require("../controllers/media.controller");
const { validateRequestHeaderToken } = require("../middlewares/jwt.middleware");

const fileHandler = fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
  debug: true,
});

Router.get("/media", controller.read);
Router.get("/media/:id", controller.find);
Router.get("/media/:id/preview", controller.preview);
Router.post("/media", fileHandler, controller.create);
Router.patch("/media/:id", controller.edit);
Router.delete("/media/:id", controller.delete);

Router.get("/media/p/r", controller.readSet);
Router.patch("/media/:id/set", controller.set);

module.exports = Router;
