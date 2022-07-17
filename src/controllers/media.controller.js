const { unlink } = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const ApiClientError = require("../errors/ApiClientError");
const knex = require("../utils/knex.js");

exports.create = async (req, res, next) => {
  try {
    const { file = undefined } = req.files;
    const { name } = req.body;

    // Check if name does exists...
    const [mediaExists] = await knex
      .select("*")
      .table("medias")
      .where({
        name,
      })
      .limit(1);

    if (mediaExists) {
      throw new ApiClientError("Media name already exists.", 400);
    }

    let _path = null;

    if (file !== undefined) {
      _path = [uuidv4(), file.name.split(".").pop()].join(".");

      const upload_path = path.resolve(__dirname, "../../uploads/", _path);

      await file.mv(upload_path);
    }

    const mediaObject = {
      uuid: uuidv4(),
      name,
      path: _path,
    };

    await knex.table("medias").insert(mediaObject);

    res.json({
      message: "Successfully created and uploaded a media.",
      sub: mediaObject,
    });
  } catch (err) {
    next(err);
  }
};

exports.read = async (req, res, next) => {
  try {
    const q = `%${req.query.q || ""}%`;

    const medias = await knex.select("*").table("medias").whereILike("name", q);

    res.json({
      message: "Successfully retrieved medias.",
      sub: medias,
    });
  } catch (err) {
    next(err);
  }
};

exports.find = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [media] = await knex.select("*").table("medias").where({
      uuid: id,
    });

    if (!media) {
      throw new ApiClientError("Media does not exists.", 404);
    }

    res.json({
      message: "Successfully retrieved media.",
      sub: media,
    });
  } catch (err) {
    next(err);
  }
};

exports.preview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [media] = await knex.select("*").table("medias").where({
      uuid: id,
    });

    if (!media) {
      throw new ApiClientError("Media does not exists.", 404);
    }

    res.sendFile(path.resolve(__dirname, "../../uploads", media.path));
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [media] = await knex.select("*").table("medias").where({
      uuid: id,
    });

    if (!media) {
      throw new ApiClientError("Media does not exists.", 404);
    }

    const { name } = req.body;

    const [isNameTaken] = await knex
      .select("*")
      .table("medias")
      .where({
        name,
      })
      .whereNot({
        uuid: id,
      });

    if (isNameTaken) {
      throw new ApiClientError("Media name already exists.", 400);
    }

    const mediaObject = {
      name,
    };

    await knex("medias").where("uuid", id).update(mediaObject);

    res.json({
      message: "Successfully updated a media.",
      sub: {
        ...media,
        ...mediaObject,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [media] = await knex.select("*").table("medias").where({
      uuid: id,
    });

    if (!media) {
      throw new ApiClientError("Media does not exists.", 404);
    }

    await unlink(path.resolve(__dirname, "../../uploads", media.path));

    await knex("medias").where("uuid", id).del();

    res.json({
      message: "Successfully deleted a media.",
      sub: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.set = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { screen } = req.body;

    const [mediaExists] = await knex.select("*").from("medias").where({
      uuid: id,
    });

    if (!mediaExists) {
      throw new ApiClientError("Media does not exists.", 404);
    }

    await knex("medias").where("slot", screen).update({ slot: null });

    await knex("medias").where("uuid", id).update({ slot: screen });

    res.json({
      message: "Successfully set the media to screen " + screen + ".",
    });
  } catch (err) {
    next(err);
  }
};

exports.readSet = async (req, res, next) => {
  try {
    const medias = await knex.select("*").from("medias").whereNot("slot", null);

    res.json({
      message: "Successfully retrieved medias.",
      sub: medias,
    });
  } catch (err) {
    next(err);
  }
};
