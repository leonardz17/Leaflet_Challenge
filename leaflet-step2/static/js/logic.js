// Tile layers
var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
});

var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

// Create base maps layer
var baseMaps = {
    "Dark Map": darkMap,
    "Street Map": streetMap,
    "Satellite Map": satMap
};

// function for circle/legend colors
function chooseColor (depth) {
    var color = "#A7F210"
    if (depth > 90){
        color = "#E74C3C"
    }else if (depth >= 70){
        color = "#D35400"
    }else if (depth >= 50){
        color = "#F39C12"
    }else if (depth >= 30){
        color = "#F1C40F"
    }else if (depth >= 10){
        color = "#D9DF00"
    }
    return color;
};

// Query URL for earthquake GeoJSON data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// geojson earthquake layer
var earthQuakes = L.layerGroup();
d3.json(queryUrl, function(data) {
    console.log(data.features);

    L.geoJSON(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 3.5,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "white",
                weight: 1,
                opacity: 0.6,
                fillOpacity: 0.6
            })
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.place + "<hr> " + "Magnitude " +feature.properties.mag  + "<br> " +"Depth " +feature.geometry.coordinates[2]+ "<br> " +new Date(feature.properties.time));
        }
    }).addTo(earthQuakes);

});

// data path for tectonic plates 
var platePath = "static/data/PB2002_boundaries.json";

// geojson tectonic plates layer
var plates = L.layerGroup();
d3.json(platePath, function(data){
    console.log(data);

    L.geoJSON(data, {
        style: function(feature) {
            return {
                color: "orange",
                fillColor: "transparent",
                weight: 1.5
            };
        }
    }).addTo(plates);
})

// Map overlays
var overlayMaps = {
    Earthquakes: earthQuakes,
    "Tectonic Plates": plates
};

// Create map 
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [satMap, earthQuakes, plates]
});

// Layer control for overlays and base maps
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


