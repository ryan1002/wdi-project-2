'use strict';

/* -- api.cinelist.co.uk/search/cinemas/postcode/:postcode
 Get a list of cinemas within a certain distance of a UK postcode -------*/

/*-- api.cinelist.co.uk/search/cinemas/location/:location
Get a list of cinemas by searching for a UK city, town or placename------*/

/*--api.cinelist.co.uk/search/cinemas/coordinates/:latitude/:longitude
Get a list of cinemas within a radius of a set of geo coordinates-------*/

/*--api.cinelist.co.uk/get/times/cinema/:venueID?day=<INT>
Get the film times for a cinema. The day query parameter is an offset to get times for a day other than today-------*/

var map;

function performSearch() {}

function initialise(location) {
  console.log(location);

  var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
  var mapOptions = {
    center: currentLocation,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
    position: currentLocation,
    map: map
  });
}

$(document).ready(function () {
  navigator.geolocation.getCurrentPosition(initialise);
});