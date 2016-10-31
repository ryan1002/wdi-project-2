const mongoose   = require("mongoose");
const rp         = require("request-promise");
const Bluebird   = require("bluebird");
mongoose.Promise = Bluebird;
const Cinema     = require("../models/cinema");
const config     = require("../config/config");

mongoose.connect(config.db);

const lat           = 51.503186;
const lng           = -0.126446;
const radius        = 2500;
const type          = "movie_theatre";
const keyword       = encodeURIComponent("cinema");
const API_KEY       = "AIzaSyAoAcAiU79KVa27JwZ1UdRDyNomqlfhHdg";
const originalUri   = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword}&location=${lat},${lng}&radius=${radius}&type=${type}&key=${API_KEY}`;
let next_page_token = "";
let page            = 0;

function getCinemas(uri){
  let options = {
    uri: uri
  };
  return rp(options)
  .then(data => {
    let json = JSON.parse(data);
    // Get the next_page_token to make paginated requests
    next_page_token = json.next_page_token;
    console.log(`Found ${json.results.length} results.`);

    return Bluebird.map(json.results, cinema => {
      let cinemaData = {};
      cinemaData.place_id   = cinema.place_id;
      if (cinema.geometry && cinema.geometry.location) {
        cinemaData.lat      = cinema.geometry.location.lat;
        cinemaData.lng      = cinema.geometry.location.lng;
      }
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
          let json                     = JSON.parse(data);
          let cinemaData               = {};
          if (!json.result.name) return;
          cinemaData.name              = json.result.name;
          cinemaData.formatted_address = json.result.formatted_address;
          cinemaData.website           = json.result.website;
          cinemaData.rating            = json.result.rating;
          console.log(`Updating ${cinemaData.name}.`);
          return Cinema.findByIdAndUpdate(cinema._id, cinemaData, { new: true });
        });
    });
  })
  .then(cinemas => {
    page++;
    if (page === 10) {
      console.log("DONE");
      process.exit();
    }
    console.log("New url:", `${originalUri}&pagetoken=${next_page_token}`);
    return getCinemas(`${originalUri}&pagetoken=${next_page_token}`);
  })
  .catch(console.error);
}
console.log("INITIAL: ", originalUri);
getCinemas(originalUri);
