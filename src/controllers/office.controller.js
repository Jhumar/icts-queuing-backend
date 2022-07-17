const { v4: uuidv4 } = require("uuid");
const ApiClientError = require("../errors/ApiClientError");
const knex = require("../utils/knex.js");

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;

    const [officeExists] = await knex.select("*").table("offices").where({
      name,
    });

    if (officeExists) {
      throw new ApiClientError("Office name already exists.", 400);
    }

    const officeData = {
      uuid: uuidv4(),
      name,
    };

    await knex.table("offices").insert(officeData);

    res.json({
      message: "Successfully created an office.",
      sub: officeData,
    });
  } catch (err) {
    next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const q = `%${req.query.q || ""}%`;

    const offices = await knex
      .select("*")
      .table("offices")
      .whereILike("name", q);

    res.json({
      message: "Successfully retrieved offices.",
      sub: offices,
    });
  } catch (err) {
    next(err);
  }
};

exports._delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [officeExists] = await knex.select("*").table("offices").where({
      uuid: id,
    });

    if (!officeExists) {
      throw new ApiClientError("Office does not exists.", 404);
    }

    await knex("offices").where("uuid", id).del();

    res.json({
      message: "Successfully deleted an office.",
      sub: null,
    });
  } catch (err) {
    next(err);
  }
};
