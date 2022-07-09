const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");

const { PORT } = require("./src/config.js");

// Use cors middleware to allow access from other domain origin
app.use(cors());

// Use necessary middlewares from expressjs
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

// Import the api routes
app.use(require("./src/routes/auth.route.js"));
app.use(require("./src/routes/user.route.js"));
app.use(require("./src/routes/window.route"));
app.use(require("./src/routes/queue.route"));
app.use(require("./src/routes/media.route"));

// Use custom error handler express
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    stack: err.stack || null,
  });
});

http
  .createServer(app)
  .listen(PORT, () => console.log("Listening to http://localhost:" + PORT));
