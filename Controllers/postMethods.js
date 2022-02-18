const FaveList = require("../Models/FaveList");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const HttpError = require("../utils/HttpError");

exports.postFavouriteList = async (req, res, next) => {
  let { ids, NameOfTheFavouriteList } = req.body;

  let uniqueIDs = ids.filter((c, index) => {
    return ids.indexOf(c) === index;
  });

  ids = uniqueIDs;

  let existingFaveList;
  try {
    existingFaveList = await FaveList.findOne({
      TitleOfTheFavouriteList: NameOfTheFavouriteList,
    });
  } catch (err) {
    console.log(err);
  }

  if (existingFaveList) {
    const error = new HttpError("nazwa listy jest już zajęta", 422);
    return next(error);
  }

  let selectedFilms = {
    TitleOfTheFavouriteList: "",
    FilmsOfTheFavouriteList: [],
  };
  try {
    const response = await fetch("https://swapi.dev/api/films");
    const responseData = await response.json();
    const extractedData = responseData.results;

    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < extractedData.length; j++) {
        if (extractedData[j].episode_id === ids[i]) {
          selectedFilms.FilmsOfTheFavouriteList.push({
            release_date: extractedData[j].release_date,
            title: extractedData[j].title,
            characters: extractedData[j].characters,
          });
        }
      }
      selectedFilms.TitleOfTheFavouriteList = NameOfTheFavouriteList;
    }
  } catch (err) {
    console.log(err);
  }

  const { TitleOfTheFavouriteList, FilmsOfTheFavouriteList } = selectedFilms;

  const newFaveList = new FaveList({
    TitleOfTheFavouriteList,
    FilmsOfTheFavouriteList,
  });

  try {
    await newFaveList.save();
  } catch (err) {
    const error = new HttpError("nie udało się zapisać", 404);
    return next(error);
  }
  res.json({ message: "zapisano poprawnie" });
};
