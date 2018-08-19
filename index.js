'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('winston'),
    hmac = require('./controllers/Hmac'),
    standard = require('./controllers/Standard'),
    models = require('./models')

logger.add(new logger.transports.Console)

var app = express()
var serverPort = 8081;
var host = '0.0.0.0';

app.use(bodyParser.json())

  // Route validated requests to appropriate controller
app.get('/status',standard.checkstatus)
app.get('/recommendation/:recId', standard.getRecommendationStatus)
app.post('/recommendation', standard.submitRecommendation)

app.post('/sign', hmac.calcHMAC)

// initialise thee database
//require('./service/recommendation_db').init()

// Start the server 
models.sequelize.sync().then(() => {
  app.listen(serverPort, host, function () {
    logger.info('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  })  
})
