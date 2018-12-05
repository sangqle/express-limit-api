const express = require("express");
const client = require("./redis-database");
const app = express();
const limiter = require("../index")(app, client);

const port = process.env.PORT || 4000;

app.get(
  "/",
  limiter({
    path: "/users",
    method: "get",
    lookup: ["connection.remoteAddress"],
    total: 1000,
    expire: 1000 * 60 * 60,
    onRateLimited: function(request, response, next) {
      return response
        .status(429)
        .json("You are not welcome here, Rate limit exceeded");
    }
  }),
  (req, res) => {
    res.send("Welcome express-limit-api");
  }
);

app.listen(port, () => console.log(`server is running on ${port}`));
