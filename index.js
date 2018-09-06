'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('./utils/log'),
    hmac = require('./controllers/Hmac'),
    standard = require('./controllers/Standard'),
    models = require('./models'),
    auth = require('./utils/auth')

var app = express()
var serverPort = 8081;
var host = '0.0.0.0';

app.use(bodyParser.json())

  // Route validated requests to appropriate controller
app.get('/status',standard.checkstatus)
app.get('/recommendation/:recId', standard.getRecommendationStatus)
app.post('/recommendation', standard.submitRecommendation)
app.get('/:serviceId', standard.getService)
app.post('/sign', hmac.calcHMAC)


// Start the server 
models.sequelize.sync().then(() => {
  auth.initKeys()
  app.listen(serverPort, host, function () {
    logger.info('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  })  
})
