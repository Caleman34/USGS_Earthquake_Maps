// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
 // Once we get a response, send the data.features object to the createFeatures function
 createFeatures(data.features);
 console.log(data.features);
});

var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// Here we make an AJAX call to get our Tectonic Plate geoJSON data.
d3.json(plateUrl, function(plateData) {
  createLayers(plateData.features);
  console.log(plateData.features);
});

function createFeatures(earthquakeData) { // *** earthquakeData is the DATA coming from up above's query ***
 // Define a function we want to run once for each feature in the features array
 // Give each feature a popup describing the place and time of the earthquake
 function onEachFeaturePrep(feature, layer) { // **** GRAB only what is needed from the DATA *****
 layer.bindPopup("<h3>" + feature.properties.place +
 "</h3><hr><p>" + new Date(feature.properties.time));
 }
 // Create a GeoJSON layer containing the features array on the earthquakeData object
 // Run the onEachFeature function once for each piece of data in the array
 var earthquakes = L.geoJSON(earthquakeData, { // *** CALL the geoJSON function on the DATA
 onEachFeature: onEachFeaturePrep
 });
 // Sending our earthquakes layer to the createMap function
 createMap(earthquakes);
}

function createLayers(platesData) { // *** earthquakeData is the DATA coming from up above's query ***
  // Define a function we want to run once for each feature in the features array
  // // Give each feature a popup describing the place and time of the earthquake
  // function onEachFeaturePrep(feature, layer) { // **** GRAB only what is needed from the DATA *****
  // layer.bindPopup("<h3>" + feature.properties.place +
  // "</h3><hr><p>" + new Date(feature.properties.time));
  // }
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var plates = L.geoJSON(platesData, { // *** CALL the geoJSON function on the DATA
  // onEachFeature: onEachFeaturePrep
  });
  // Sending our earthquakes layer to the createMap function
  createMap(plates);
 }



// function for map layers
function createMap(earthquakes, plates) {

  // tile layers for mapbox
  var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  });

  // define basemap object to hold our base layers
  var baseMaps = {
    "Outdoors Map": outdoorsMap,
    "Gray Map": grayMap,
    "Satellite Map": satelliteMap
  };

  // create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Plates: plates
  };

  // create map, giving layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [outdoorsMap, overlayMaps]
  });

  // create a layer control
  // pass in our basemaps and overlaymaps
  // add layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
}