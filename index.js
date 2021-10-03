//import packages
const express = require('express');

//create app
const app = express();
//start listening
app.listen(3000, () => console.log('Listening at port 3000'))
//add static files
app.use(express.static('public'));