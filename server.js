const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const request = require('request');


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API for Historical UV's
app.get('/api/getHistoricalUV', function(req, res){
  request.get({url:'http://api.openweathermap.org/data/2.5/uvi/forecast?lat='+req.query.lat+'&lon='+req.query.lon+'&appid=ecb1f756686518281c429bf5b7498d70'},function(error,resp,body){
  res.send(body);
  });
});

// API for UV
/*app.get('/api/getUV', function(req, res){
  request.get({url:'http://api.openweathermap.org/data/2.5/uvi?lat='+req.query.lat+'&lon='+req.query.lon+'&appid=ecb1f756686518281c429bf5b7498d70'},function(error,resp,body){
  res.send(body);
  });
});*/

app.get('/api/getLanLong', function(req, res){
  request.get({url:'https://maps.googleapis.com/maps/api/geocode/json?address='+req.query.zipcode},function(error,resp,body){
    res.send(body);
  });
});

app.get('/api/getForecasts', function(req, res){
  request.get({url:'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+req.query.lat+'&lon='+req.query.lon+'&units=metric&appid=ecb1f756686518281c429bf5b7498d70'},function(error,resp,body){
    res.send(body);
  });
});

// API for Forecasts
/*app.get('/api/getForecast', function(req, res){
  request.get({url:'http://api.openweathermap.org/data/2.5/weather?q='+req.query.city+'&appid=ecb1f756686518281c429bf5b7498d70'},function(error,resp,body){
    res.send(body);
  });
});*/


// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
