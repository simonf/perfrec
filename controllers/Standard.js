'use strict';

var utils = require('../utils/writer.js');
var auth = require('../utils/auth.js');
var Standard = require('../service/StandardService');

module.exports.checkstatus = function checkstatus (req, res, next) {
    auth.validateRequest(req).then(function() {
	Standard.checkstatus()
	    .then(function (response) {
		utils.writeJson(res, response);
    	    })
    	    .catch(function (err) {
      		utils.writeError(res, 500, err);
    	    });
    }).catch(function(valid) {
	console.log(valid)
	if(valid == 403)
	    utils.writeError(res, 403, 'Bad or missing signature');
	else if(valid == 404)
	    utils.writeError(res, 403,'API Key not recognised');
	else utils.writeError(res, 500, 'Unknown error');
    })
};

module.exports.getRecommendationStatus = function getRecommendationStatus (req, res, next) {
    auth.validateRequest(req).then(function() {
	var recId = req.swagger.params['recId'].value;
	console.log('Checking status for '+recId)
	Standard.getRecommendationStatus(recId)
	    .then(function (response) {
		console.log('ok')
		utils.writeJson(res, response);
	    })
	    .catch(function (code) {
		console.log('fail '+code)
		utils.writeError(res, code,'Not found');
	    });
    }).catch(function(valid) {
	if(valid == 403)
	    utils.writeError(res, 403, 'Bad or missing signature');
	else if(valid == 404)
	    utils.writeError(res, 403,'API Key not recognised');
	else utils.writeError(res, 500, 'Unknown error');
    })
};

module.exports.submitRecommendation = function submitRecommendation (req, res, next) {
    console.log('submit')
    auth.validateRequest(req).then(function() {
	var recommendation = req.swagger.params['recommendation'].value;
	Standard.submitRecommendation(recommendation)
	    .then(function (response) {
		utils.writeJson(res, response);
	    })
	    .catch(function (code) {
		utils.writeError(res, code,'Recommendation was not saved');
	    });
    }).catch(function(valid) {
	if(valid == 403)
	    utils.writeError(res, 403, 'Bad or missing signature');
	else if(valid == 404)
	    utils.writeError(res, 403,'API Key not recognised');
	else utils.writeError(res, 500, 'Unknown error');
    })
};
