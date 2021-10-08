//import packages
const express = require('express');
const fs = require('fs');
const {MongoClient} = require('mongodb');

//create app
const app = express();
//start listening
app.listen(3000, () => console.log('Listening at port 3000'))
//use the express library to host static files
app.use(express.static('public'));
//enable ability to receive json data
app.use(express.json({limit: '1mb'}));

//add endpoints
app.post('/api', (request, response) => {
    response.json({
        status: "success",
        data: request.body,
    })
    updateLocalFile(request)
});

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