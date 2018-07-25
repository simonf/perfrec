'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    hmac = require('./controllers/Hmac'),
    standard = require('./controllers/Standard')

var app = express()
var serverPort = 8081;
var host = '0.0.0.0';

app.use(bodyParser.json())

  // Route validated requests to appropriate controller
app.get('/status',standard.checkstatus)
app.get('/recommendation/:recId', standard.getRecommendationStatus)
app.post('/recommendation', standard.submitRecommendation)

app.post('/sign', hmac.calcHMAC)

  // Start the server
  app.listen(serverPort, host, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);

  });
