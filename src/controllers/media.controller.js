exports.create = async (req, res, next) => {
  try {
    res.json({
      files: req.files
    });
  }
  catch(err) {
    next(err);
  }
};
