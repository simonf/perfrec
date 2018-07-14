'use strict';

var utils = require('../utils/writer.js');
var validate = require('../utils/auth.js');
var Standard = require('../service/StandardService');

module.exports.checkstatus = function checkstatus (req, res, next) {
    var valid = validate.validateRequest(req)
    if(valid == 403)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Bad or missing signature"}'));
    else if(valid == 404)
	utils.writeJson(res, utils.respondWithCode(404,'{ "status": "Not recognised"}'));
    else if(valid==200) {
	Standard.checkstatus()
	    .then(function (response) {
		utils.writeJson(res, response);
    	    })
    	    .catch(function (err) {
      		utils.writeJson(res, utils.respondWithCode(err, '{}'));
    	    });
    } else {
	utils.writeJson(res, utils.respondWithCode(500,'{ "status": "Unknown error"}'));
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
