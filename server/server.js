require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
 
//Routes
app.use(require('../routes/server.routes'));

 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto ', process.env.PORT);
})