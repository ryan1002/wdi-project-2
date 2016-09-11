// You will need to get your GoogleMaps API key
// Make a request to the API to get all of the restaurants
// Display then on the page with GMaps
// BONUS: Mark your current location on the map
// BONUS BONUS: Add restul routes


const googleMap = googleMap || {};

googleMap.mapSetup = function(){
  let canvas = document.getElementById('map-canvas');

  let mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  this.map = new google.maps.Map(canvas, mapOptions);

};
//initialise location
function initialise(location) {
  console.log(location);
}


// grab current location
navigator.geolocation.getCurrentPosition(initialise);

$(googleMap.mapSetup.bind(googleMap));
