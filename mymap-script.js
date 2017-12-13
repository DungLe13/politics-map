mapboxgl.accessToken = 'pk.eyJ1IjoiZGxlMTMxMCIsImEiOiJjajRkM2xoYW4waWFtMnFydDR2anFmd2UwIn0.GRuF5rGA1C6xXftwjdw-oQ';
var map = new mapboxgl.Map({
    container: 'mapid',
    center: [-102.8319251, 38.1266536],
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 4
});

map.on('load', function(e) {
	// ADD SOURCES: both
	map.addSource("both", {
		type: "geojson",
		data: "both.geojson"
	});

	// ADD LAYERS default (both parties)
	map.addLayer({
		"id": "bothParties",
		"type": "circle",
		"source": "both",
		"paint": {
			"circle-radius": 8,
			"circle-color": {
				property: 'party',
				stops: [[0, '#fbb03b'], [1, '#3bb2d0']]
			}
		}
	});
})

map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
}));

// LISTEN TO DROPDOWN CHANGE
var dropdownSelection = document.getElementById("mySelect")
dropdownSelection.addEventListener('change', function() {
	if (dropdownSelection.value == "dems") {
		try {
			map.removeSource("both");
			map.removeLayer("bothParties");
		} catch(err) {
			console.log("Both parties layer is not currently selected. Remove republicans layer instead.")
			map.removeSource("republicans");
			map.removeLayer("repubs");
			map.removeImage("1");
			map.removeImage("0");
		}

		map.loadImage('images/happy_hillary.gif', function(error, image) {
			map.addImage('1', image)
		});

		map.loadImage('images/sad_hillary.gif', function(error, image) {
			map.addImage('0', image)
		});

		map.addSource("democrats", {
			type: "geojson",
			data: "democrats.geojson"
		});

		map.addLayer({
			"id": "dems",
			"type": "symbol",
			"source": "democrats",
			"layout": {
				"icon-image": "{sentiment}"
			}
		});
	} else if (dropdownSelection.value == "repubs") {
		try {
			map.removeSource("both");
			map.removeLayer("bothParties");
		} catch(err) {
			console.log("Both parties layer is not currently selected. Remove democrats layer instead.")
			map.removeSource("democrats");
			map.removeLayer("dems");
			map.removeImage("1");
			map.removeImage("0");
		}

		map.loadImage('images/happy_trump.gif', function(error, image) {
			map.addImage('1', image)
		});

		map.loadImage('images/angry_trump.gif', function(error, image) {
			map.addImage('0', image)
		});

		map.addSource("republicans", {
			type: "geojson",
			data: "republicans.geojson"
		});

		map.addLayer({
			"id": "repubs",
			"type": "symbol",
			"source": "republicans",
			"layout": {
				"icon-image": "{sentiment}"
			}
		});
	} else {
		try {
			map.removeSource("democrats");
			map.removeLayer("dems");
			map.removeImage("1");
			map.removeImage("0");
		} catch(err) {
			console.log("Democrats layer is not currently selected. Remove republicans layer instead.")
			map.removeSource("republicans");
			map.removeLayer("repubs");
			map.removeImage("1");
			map.removeImage("0");
		}

		map.addSource("both", {
			type: "geojson",
			data: "both.geojson"
		});

		map.addLayer({
			"id": "bothParties",
			"type": "circle",
			"source": "both",
			"paint": {
				"circle-radius": 8,
				"circle-color": {
					property: 'party',
					stops: [[0, '#fbb03b'], [1, '#3bb2d0']]
				}
			}
		});
	}
})


// POPUP SETTINGS
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});

map.on('mouseenter', 'bothParties', function(e){
    map.getCanvas().style.cursor = 'pointer'; //change cursor 
    //Populate pop-up with information from our geojson file
    //Add to map on hover (or mouseenter), with "Magnitude: "
    popup.setLngLat(e.features[0].geometry.coordinates)
         .setHTML(e.features[0].properties.tweet_body)
         .addTo(map);  
});
