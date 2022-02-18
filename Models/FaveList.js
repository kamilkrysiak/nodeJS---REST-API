const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

const FaveListSchema = new Schema({
  TitleOfTheFavouriteList: {
    type: String,
    required: true,
  },
  FilmsOfTheFavouriteList: [{ type: Object,  required: true,  }],
});

module.exports = mongoose.model("FaveList", FaveListSchema);
