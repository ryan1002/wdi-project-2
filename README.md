# wdi-project-2

#Purpose of the project

The purpose of the project was to make a web app using the cinelist api that finds your nearest cinema according to your current location. 


#The initial setup

I used bower as a package manager to help manage jQuery and bootstrap dependencies. This was done to save a lot of time and white space. This also made my code look a lot more cleaner.  I also used gulp to help manage, convert and minify all of my css and javaScript. Having done this, also allowed me to see live changes made inside my application: therefore, I didn’t have to run nodemon inside the terminal every time I made changes to my web app.

_______________________________________________________________

The cinelist API a acquired from their website didn’t have an appropriate end point that I could use to make a simply ajax request to populate my map. Another tactic was used. I had to install bluebird and require it inside my seed.js file. This method was employed because I needed latitude and longitude values that could be used to correctly populate my map and also provide some useful information: like a postcode and address.  

#Structure of the project  


The first thing I needed was an API key. This is a key that can be acquired from Google Maps API and acquired under their guides section.  

This I included within a `<script>` tag inside the `<head>` section of my index.html file. 

______________________________________________________________

The maps dimension were set within my `style.css` file. This allowed the map to extend across the whole browser window. The code as follows:

`#map-canvas {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
}` 
_____________________________________________________________
`#map-canvas` is simply a reference id to where the map was going to be displayed inside my application. 
  `<div id="map-canvas"></div>`

_____________________________________________________________








