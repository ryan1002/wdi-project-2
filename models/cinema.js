const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
  name:               { type: String, trim: true, required: true },
  image:              { type: String, trim: true, required: true },
  description:        { type: String, trim: true },
  lat:                { type: String, time: true, required: true },
  lng:                { type: String, time: true, required: true },
  formatted_address:  { type: String, time: true },
  website:            { type: String, time: true },
  rating:             { type: Number, time: true },
  place_id:    { type: String, time: true, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Cinema", cinemaSchema);
