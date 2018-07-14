'use strict';

var utils = require('../utils/writer.js');
var auth = require('../utils/auth.js');
var Standard = require('../service/StandardService');

module.exports.checkstatus = function checkstatus (req, res, next) {
    var valid = auth.validateRequest(req)
    if(valid == 403)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Bad or missing signature"}'));
    else if(valid == 404)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Not recognised"}'));
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
    var valid = auth.validateRequest(req)
    if(valid == 403)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Bad or missing signature"}'));
    else if(valid == 404)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Not recognised"}'));
    else if(valid==200) {
	var recId = req.swagger.params['recId'].value;
	console.log('Checking status for '+recId)
	Standard.getRecommendationStatus(recId)
	    .then(function (response) {
		console.log('ok')
		utils.writeJson(res, response);
	    })
	    .catch(function (code) {
		console.log('fail '+code)
		utils.writeJson(res, utils.respondWithCode(code,'{}'));
	    });
    }
};

module.exports.submitRecommendation = function submitRecommendation (req, res, next) {
    var valid = auth.validateRequest(req)
    if(valid == 403)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Bad or missing signature"}'));
    else if(valid == 404)
	utils.writeJson(res, utils.respondWithCode(403,'{ "status": "Not recognised"}'));
    else if(valid==200) {
	var recommendation = req.swagger.params['recommendation'].value;
	Standard.submitRecommendation(recommendation)
	    .then(function (response) {
		utils.writeJson(res, response);
	    })
	    .catch(function (code) {
		utils.writeJson(res, utils.respondWithCode(code,'{}'));
	    });
    }
};
