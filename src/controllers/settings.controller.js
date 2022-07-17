const { v4: uuidv4 } = require("uuid");
const ApiClientError = require("../errors/ApiClientError");
const knex = require("../utils/knex.js");

exports.read = async (req, res, next) => {
  try {
    const settings = await knex.select("*").from("settings");

    res.json({
      message: "Successfully retrieved settings.",
      sub: settings,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, value } = req.body;

    const [nameExists] = await knex
      .select("*")
      .from("settings")
      .where({ name });

    if (!nameExists) {
      throw new ApiClientError("Setting does not exists.", 404);
    }

    await knex("settings").where("name", name).update({ value });

    res.json({
      message: "Successfully updated a setting.",
    });
  } catch (err) {
    next(err);
  }
};
