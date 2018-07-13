'use strict';

var utils = require('../utils/writer.js');
var validate = require('../utils/auth.js');
var Standard = require('../service/StandardService');

module.exports.checkstatus = function checkstatus (req, res, next) {
  if(validate.validateRequest(req)) {
	  Standard.checkstatus()
	    .then(function (response) {
	      utils.writeJson(res, response);
    	})
    	.catch(function (err) {
      		utils.writeJson(res, utils.respondWithCode(err, '{}'));
    	});
  } else {
	console.log('validateRequest returned false')
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Bad or missing signature"}'));
  }
};

module.exports.getRecommendationStatus = function getRecommendationStatus (req, res, next) {
  var recId = req.swagger.params['recId'].value;
  Standard.getRecommendationStatus(recId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.submitRecommendation = function submitRecommendation (req, res, next) {
  var recommendation = req.swagger.params['recommendation'].value;
  Standard.submitRecommendation(recommendation)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
