const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const HttpError = require("../utils/HttpError");
const FaveList = require("../Models/FaveList");
const XLSX = require("xlsx");

exports.getAllFilms = async (req, res, next) => {
  let data;
  try {
    const response = await fetch("https://swapi.dev/api/films");
    const responseData = await response.json();
    const extractedData = responseData.results.map((element) => {
      return {
        release_date: element.release_date,
        title: element.title,
        id: element.episode_id,
      };
    });
    data = extractedData;
  } catch (err) {
    const error = new HttpError("Błąd pobierania danych", 500);
    return next(error);
  }
  res.status(200).json({ data });
};

exports.getSpecificList = async (req, res, next) => {
  const id = req.params.id;

  let faveList;
  try {
    faveList = await FaveList.findById(id);
  } catch (err) {
    const error = new HttpError(
      "nie można znaleźć ten listy, spróbuj za chwilę",
      422
    );
    return next(error);
  }
  res.status(200).json({ faveList: faveList.toObject({ getters: true }) });
};

exports.getFavouriteLists = async (req, res, next) => {
  const page = req.query.page;
  let allTheFavouriteLists = [];
  try {
    allTheFavouriteLists = await FaveList.find()
      .skip((page - 1) * 2)
      .limit(2);
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ allTheFavouriteLists });
};

exports.FavouriteListToFile = async (req, res, next) => {
  const id = req.params.id;
  const file = req.params.file;
  let specificList;
  if (id && file === "file") {
    try {
      specificList = await FaveList.findById(id);
    } catch (err) {
      const error = new HttpError(
        "problem ze znalezieniem listy, sprobuj za chwilę",
        422
      );
      return next(error);
    }

    const charactersURLs = [];

    specificList.FilmsOfTheFavouriteList.forEach((list) => {
      const abcd = list.characters;

      abcd.forEach((dcba) => charactersURLs.push(dcba));
    });
    console.log(charactersURLs);

    let uniqueCharacterURLs = charactersURLs.filter((c, index) => {
      return charactersURLs.indexOf(c) === index;
    });

    let charactersObjects = [];

    try {
      for (var i = 0; i < uniqueCharacterURLs.length; i++) {
        const response = await fetch(uniqueCharacterURLs[i]);
        const responseData = await response.json();
        charactersObjects.push(responseData);
      }
    } catch (err) {
      console.log(err);
    }

    const charactersNames = [];

    charactersObjects.forEach((charactersObject) => {
      const name = charactersObject.name;
      charactersNames.push({ name });
    });

    const workSheet = XLSX.utils.json_to_sheet(charactersNames);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "charactersnames");
    XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
    const random = Math.floor(Math.random() * 999999);
    XLSX.writeFile(workBook, `charactersnames ${random}.xlsx`);

    res.status(200).json({ message: "plik zapisany poprawnie" });
  }
};
