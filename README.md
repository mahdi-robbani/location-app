# Location App

A simple web app built using Node.js, Leaflet.js, Express, MongoDB and Bootstrap. It uses the [OpenWeather API](https://openweathermap.org/) to gather weather information adn the [Open Air Quality API](https://openaq.org/#/). The app consists of the following pages:
1. A home page where users can find their location, weather information, air quality information and view it on a map.
2. A map of all previous locations identified.
3. A list of all previous locations identified.
4. A page that tracks the International Space Station (ISS) in real time.

## Running the app
To install and run the app locally:
1. Install dependencies  by using `npm install`
2. Rename `.env_sample` to `.env` and fill in the required varibles
3. Start the server by using `node server.js`

Alternatively, the app can be viewed on [Heroku](https://hidden-dusk-05961.herokuapp.com/index.html)

## Viewing the web page
Go to `http://localhost:3000/` on a web browser
