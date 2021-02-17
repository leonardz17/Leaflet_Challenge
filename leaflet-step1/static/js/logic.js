// Create map 
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
});

// Tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
}).addTo(myMap);

// Query URL for earthquake GeoJSON data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// function for circle colors
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
                fillOpacity: 0.3
            })
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.place + "<hr> " + "Magnitude " +feature.properties.mag  + "<br> " +"Depth " +feature.geometry.coordinates[2]+ "<br> " +new Date(feature.properties.time));
        }
    }).addTo(myMap);


});
