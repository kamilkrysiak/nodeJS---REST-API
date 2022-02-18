const express = require("express");
const router = express.Router();

const postMethods = require("../Controllers/postMethods");

router.post("/favourites", postMethods.postFavouriteList);

module.exports = router;
