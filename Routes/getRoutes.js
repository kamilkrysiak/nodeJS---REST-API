const express = require("express");

const getMethods = require("../Controllers/getMethods");
const router = express.Router();

router.get("/films", getMethods.getAllFilms);
router.get("/favourites/:id", getMethods.getSpecificList);
router.get("/favourites/:id/:file", getMethods.FavouriteListToFile);

module.exports = router;
