const mongoose     = require("mongoose");
const cinemaSchema = new mongoose.Schema({
  name:               { type: String, trim: true },
  lat:                { type: String, trim: true, required: true },
  lng:                { type: String, trim: true, required: true },
  formatted_address:  { type: String, trim: true },
  website:            { type: String, trim: true },
  rating:             { type: String, trim: true },
  place_id:           { type: String, trim: true, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Cinema", cinemaSchema);
