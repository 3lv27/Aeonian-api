'use strict';

function startMap () {
  var map = new google.maps.Map(
    document.getElementById('map-search'),
    {
      zoom: 15
    }
  );

  let markers = [];
  challenges.forEach(function (challenge) {
    let title = challenge.challengeName;
    let position = {
      lat: challenge.location.coordinates[1],
      lng: challenge.location.coordinates[0]
    };
    var pin = new google.maps.Marker({ position, map, title });
    markers.push(pin);
  });

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
}

startMap();
