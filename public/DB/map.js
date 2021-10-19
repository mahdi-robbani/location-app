//create map and tiles
//use tiles from openstreetmap
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const geoMap = L.map('geoMap', {minZoom: 2}).setView([0, 0], 2);
const tileOptions = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}
const tiles = L.tileLayer(tileUrl, tileOptions)
tiles.addTo(geoMap)

async function getData(){
  const request = await fetch('../api/');
  const data = await request.json();
  console.log(data)

  for (item of data){
    //create marker
    const marker = L.marker([item.lat, item.long]).addTo(geoMap)
    //get marker text
    let aq;
    if (item.aqArray.length > 0) {
      const measurement = item.aqArray[0].measurements[0]
      aq = `Air Quality (${measurement.parameter}): ${measurement.value}${measurement.unit}`
    } else {
      aq = 'Air Quality: No Data Available'
    }
    const txt = `Latitude: ${item.lat.toFixed(2)},
                 Longitude: ${item.long.toFixed(2)},
                 Weather: ${item.weather},
                 Temperature: ${(item.temp - 273.15).toFixed(2)}°C,
                 Feels like: ${(item.feels - 273.15).toFixed(2)}°C,
                 Humidity: ${item.humidity}%,
                 ${aq}`
    //add text to marker
    marker.bindPopup(txt)
  }
}

//Add markers and text to map
getData();
