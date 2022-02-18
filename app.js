const express = require("express");
const app = express();

const mongoose = require("mongoose");

const HttpError = require("./utils/HttpError");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const postRoutes = require("./Routes/postRoutes");
const getRoutes = require("./Routes/getRoutes");

app.use(postRoutes);
app.use(getRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Nieznany błąd" });
});

mongoose
  .connect(
    `mongodb+srv://Kamil:SY7yLDeGBuI3oHRk@recruitmentcluster.gffih.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
    console.log("działa");
  })
  .catch((err) => {
    console.log(err);
  });
