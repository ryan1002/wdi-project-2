
/* -- api.cinelist.co.uk/search/cinemas/postcode/:postcode
Get a list of cinemas within a certain distance of a UK postcode -------*/

/*-- api.cinelist.co.uk/search/cinemas/location/:location
Get a list of cinemas by searching for a UK city, town or placename------*/

/*--api.cinelist.co.uk/search/cinemas/coordinates/:latitude/:longitude
Get a list of cinemas within a radius of a set of geo coordinates-------*/

/*--api.cinelist.co.uk/get/times/cinema/:venueID?day=<INT>
Get the film times for a cinema. The day query parameter is an offset to get times for a day other than today-------*/

var map;
var service;
var currentLocation;
var API_URL = "http://localhost:3000/api";
var markers = [];
var infoWindow;

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

  if (getToken()) {
    loggedIn();
  } else {
    loggedOut();
  }
}

function loggedIn(){
  $(".loggedOut").hide();
  $(".loggedIn").show();
}

function loggedOut(){
  $(".loggedOut").show();
  $(".loggedIn").hide();
  clearMarkers();
}

function eventListeners() {
  $('.logout').on('click', showLogout);
  $(".modal").on("submit", "form", handleForm);
}

function showAbout() {

}

function handleForm(){
  event.preventDefault();
  let url    = `${API_URL}${$(this).attr("action")}`;
  let method = $(this).attr("method");
  let data   = $(this).serialize();

  return ajaxRequest(url, method, data, (data) => {
    if (data.token) setToken(data.token);
    $(this).parents(".modal").modal("hide");
    loggedIn();
    if (getToken()){
      let url    = `${API_URL}/cinemas`;
      let method = "get";
      let data   = null;

      return ajaxRequest(url, method, data, (data) => {
        handleSearchResults(data);
      });
    }
  });
}

function addInfoWindowForCinema(cinema, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof infoWindow != "undefined") infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      content: `<h4>${cinema.name}</h4>
                <p>${cinema.formatted_address}</p>
                <a href="http://${cinema.website}">${cinema.website}</a>
                <p>${cinema.rating}</p>
               `
    });

    infoWindow.open(map, marker);
  });
}

var icon = {
    url: "images/cinema-vector.png", // url
    scaledSize: new google.maps.Size(10, 20), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};


// function addMarkerWithTimeout(position, timeout) {
//      window.setTimeout(function() {
//        markers.push(new google.maps.Marker({
//          position: position,
//          map: map,
//          animation: google.maps.Animation.DROP
//        }));
//      }, timeout);
//    }


function handleSearchResults(results){

  for(var i = 0; i < results.cinemas.length; i++){
    var latlng = new google.maps.LatLng(results.cinemas[i].lat, results.cinemas[i].lng);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      animation: google.maps.Animation.DROP,
      icon: "../images/cinema-vector.png"

    });
    // push marker in an array object to delete
    markers.push(marker);
    addInfoWindowForCinema(results.cinemas[i], marker);
  }
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

  if (getToken()){
    let url    = `${API_URL}/cinemas`;
    let method = "get";
    let data   = null;

    return ajaxRequest(url, method, data, (data) => {
      handleSearchResults(data);
    });
  }

}


function showLogout() {
  event.preventDefault();
  window.localStorage.clear();
  loggedOut();
}

function clearMarkers() {
  markers.forEach((marker, index) => {
    marker.setMap(null);
  });
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
