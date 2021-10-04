//import packages
const express = require('express');

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
    console.log(request.body);
});
//nodemon ./server.js