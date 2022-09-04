const neo4j = require("neo4j-driver");
const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const baseRouter = require('./routes/router');

// const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
// const session = driver.session({ database: "neo4j" });

const app = express();
const PORT = process.env.PORT || 5450;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/', baseRouter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // if(req.method === 'OPTIONS'){
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  // }
  next();
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT);