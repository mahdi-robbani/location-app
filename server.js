//import and set up environment modules
import dotenv from 'dotenv'
dotenv.config()

//import packages
import express from 'express'
import fs from 'fs'
import { MongoClient, CURSOR_FLAGS, ObjectId } from 'mongodb'
import fetch from 'node-fetch';


//create app
const app = express();
//start listening
app.listen(3000, () => console.log('Listening at port 3000'))
//use the express library to host static files
app.use(express.static('public'));
//enable ability to receive json data
app.use(express.json({limit: '1mb'}));

//db url
const url = 'mongodb://127.0.0.1:27017'
//new instance of mongo client
const client = new MongoClient(url);

//add endpoints
app.get('/api', (request, response) => {
    //access info from db and send to response
    accessDb(response);
});

app.post('/api', (request, response) => {
    response.json({
        status: "success",
        data: request.body,
    })
    //updateLocalFile(request)
    updateDb(request, "locations")
});


app.get('/weather/:lat/:lon', async (request, response) => {
    //use openweather API
    const lat = request.params.lat;
    const lon = request.params.lon;
    const APIkey = process.env.API_KEY

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    
    const aqUrl = `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat},${lon}&radius=1000&order_by=lastUpdated&dumpRaw=false`
    const aqResponse = await fetch(aqUrl);
    const aqData = await aqResponse.json();

    const data = {
        weather: weatherData,
        aq: aqData,
    }
    response.json(data);
})

app.post('/weather', (request, response) => {
    response.json({
        status: "success",
        data: request.body,
    })
    console.log(request.body)
    updateDb(request, "weather")
});

app.post('/delete_location', (request, response) => {
    response.json({
        status: "success",
        info: `Deleted location ID: ${request.body.locationID}`
    })
    deleteLocation(request.body.locationID)
})


async function deleteLocation(locationID){
    try{
        //connect to client
        await client.connect();

        //delete location
        const result = await client.db("selfie-data-app").collection("locations").deleteOne({ "_id" : ObjectId(locationID) } );
        console.log(`${result.deletedCount} ID deleted: ${locationID}`);

    } catch (e) {
        console.error(e)
    } finally {
        //close connection after performing all operations
        await client.close()
    }
}

async function accessDb(response){
    try{
        //connect to client
        await client.connect();

        //list all entries
        const data = await getAllLocations(client)

        //send data
        response.json(data);
    } catch(e){
        console.error(e);
    } finally {
        await client.close(); 
    }
}

async function updateDb(request, collectionName){
    try{
        //connect to client
        await client.connect();

        //list databases
        //await listDatabases(client);

        //update database
        const newLocation = {
            date: Date.now(),
            lat: request.body.latitude,
            long: request.body.longitude,
            weather: request.body.weather.weather[0].main,
            temp: request.body.weather.main.temp,
            feels: request.body.weather.main.feels_like,
            aqArray: request.body.aqArray,
        }
        await createLocation(client, newLocation, collectionName);

    } catch (e) {   
        console.error(e)
    } finally {
        //close connection after performing all operations
        await client.close()
    }
}

async function createLocation(client, newLocation, collectionName){
    const result = await client.db("selfie-data-app").collection(collectionName).insertOne(newLocation);
    console.log(`New location ID: ${result.insertedId}`);
}

async function listDatabases(client) {
    //function to list all databases
    databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(` - ${db.name}`)
    });
};

async function showAllLocations(client){
    const cursor = await client.db("selfie-data-app").collection("locations").find();
    const result = await cursor.toArray()
    result.forEach(document => console.log(document))
}

async function getAllLocations(client){
    const cursor = await client.db("selfie-data-app").collection("locations").find();
    const result = await cursor.toArray();
    return result;
}

function updateLocalFile(request){
    fs.readFile("location.txt", 'utf-8', (err, data) => {
        console.log("File loaded")
        location = JSON.parse(data)
        location.push(request.body)
        console.log(location)
        fs.writeFile("location.txt", JSON.stringify(location), (err) => {
            if (err) throw err;
            console.log("File saved")
        })
    })
}

//nodemon ./server.js