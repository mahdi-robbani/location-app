if('geolocation' in navigator) {
    console.log('Geolocation is available')
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords
      //console.log(position.coords.latitude, position.coords.longitude);
      document.getElementById('lat').textContent = position.coords.latitude;
      document.getElementById('lon').textContent = position.coords.longitude;
  });
  } else {
    console.log('Geolocation is not available')
  }