'use strict';

function startMap() {
  var map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 15
    }
  );

  // geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      // var ironHackBCNMarker = new google.maps.Marker({
      //   position: {
      //     lat: user_location.lat,
      //     lng: user_location.lng
      //   },
      //   map: map,
      //   title: 'You are here'
      // });
    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }

  // marker on click
  var marker;

  map.addListener('click', (event) => {
    placeMarker(event.latLng);
    console.log(event.latLng);
    document.getElementById('latitude').value = event.latLng.lat();
    document.getElementById('longitude').value = event.latLng.lng();
  });

  function placeMarker(location) {
    if (marker == null) {
      marker = new google.maps.Marker({
        position: location,
        map: map
      });
    } else { marker.setPosition(location); }
  }
}

startMap();
