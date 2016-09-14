
/* -- api.cinelist.co.uk/search/cinemas/postcode/:postcode
Get a list of cinemas within a certain distance of a UK postcode -------*/

/*-- api.cinelist.co.uk/search/cinemas/location/:location
Get a list of cinemas by searching for a UK city, town or placename------*/

/*--api.cinelist.co.uk/search/cinemas/coordinates/:latitude/:longitude
Get a list of cinemas within a radius of a set of geo coordinates-------*/

/*--api.cinelist.co.uk/get/times/cinema/:venueID?day=<INT>
Get the film times for a cinema. The day query parameter is an offset to get times for a day other than today-------*/

//
// var map;
// var service;
//
// function handleSearchResults(results, status){
//   console.log(results);
//
//   for(var i = 0; i < results.length; i++){
//     var marker = new google.maps.Marker({
//       position: results[i].geometry.location,
//       map: map,
//       // icon: "cinema-vector.png"
//     });
//   }
//
// }
//
// function performSearch(){
//   var request = {
//     bounds: map.getBounds(),
//     name: "cinemas"
//   };
//   service.nearbySearch(request, handleSearchResults);
// }
//
// function initialise(location) {
//   console.log(location);
//
//   var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
//   var mapOptions = {
//     center: currentLocation,
//     zoom: 12,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//
//   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//
//   var marker = new google.maps.Marker({
//     position: currentLocation,
//     map: map
//   });
//
// service = new google.maps.places.PlacesService(map);
//
// //ensure that waits until the map bounds are initialised
// google.maps.event.addListenerOnce(map, 'bounds_changed', performSearch);
//
//
// }
//
// $(document).ready(function(){
//     navigator.geolocation.getCurrentPosition(initialise);
// });

var map;
var service;
var currentLocation;
var API_URL = "http://localhost:3000/api";

$(init);

function init() {
  eventListeners();
  navigator.geolocation.getCurrentPosition(function(position) {
    currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    showMap();
  });
}

function eventListeners() {
  $('.logout').on('click', showLogout);
  $(".modal").on("submit", "form", handleForm);
}

function handleForm(){
  event.preventDefault();
  console.log("FORM")
  let url    = `${API_URL}${$(this).attr("action")}`;
  let method = $(this).attr("method");
  let data   = $(this).serialize();

  return ajaxRequest(url, method, data, (data) => {
    if (data.token) setToken(data.token);
    console.log(data);
  });
}

function showMap() {
  var mapOptions = {
    center: { lat: currentLocation.lat, lng: currentLocation.lng },
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles:
    [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]

  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}


function showLogout() {
  event.preventDefault();
  $window.localStorage.clear();
}


function ajaxRequest(url, method, data, callback){
  return $.ajax({
    url,
    method,
    data,
    beforeSend: setRequestHeader
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
}

function setRequestHeader(xhr, settings) {
  return xhr.setRequestHeader("Authorization", `Bearer ${getToken()}`);
}

function setToken(token) {
  return window.localStorage.setItem("token", token);
}

function getToken(token) {
  return window.localStorage.getItem("token");
}
