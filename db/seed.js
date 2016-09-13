const mongoose   = require("mongoose");
const rp         = require("request-promise");
const Bluebird   = require("bluebird");
mongoose.Promise = Bluebird;

const Cinema = require("../models/cinema");

// BUILD URL
const lat        = 51.503186;
const lng        = -0.126446;
const radius     = 2500;
const type       = "movie_theatre";
const API_KEY    = "AIzaSyAoAcAiU79KVa27JwZ1UdRDyNomqlfhHdg";
const uri        = `https://maps.googleapis.com/maps/api/place/radarsearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}`;

function getCinemas(uri){
  let options = {
    uri: uri
  };

  return rp(options);
}

// Clear database of restaurants
Cinema.collection.drop();

getCinemas(uri)
  .then(data => {
    return Bluebird.map(data.results, restaurant => {
      let cinemaData = {};
      cinemaData.place_id = cinema.place_id;
      cinemaData.lat      = cinema.geometry.location.lat;
      cinemaData.lng      = cinema.geometry.location.lng;
      return Cinema.create(cinemaData);
    });
  })
  .then(cinemas => {
    return Bluebird.map(cinemas, cinema => {
      let options = {
        uri: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${cinema.place_id}&key=${API_KEY}`
      };

      return rp(options)
        .then(data => {
          let cinemaData = {};
          cinemaData.name              = data.result.name;
          cinemaData.formatted_address = data.result.formatted_address;
          cinemaData.website           = data.result.website;
          cinemaData.rating            = data.result.rating;
          return Cinema.findByIdAndUpdate(cinema._id, cinemaData, { new: true });
        });
    });
  })
  .then(cinemas => {
    console.log(cinemas);
    console.log("DONE");
    return process.exit();
  })
  .catch(console.error);
