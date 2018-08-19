'use strict';

var utils = require('../utils/writer.js');
var auth = require('../utils/auth.js');
var Standard = require('../service/StandardService');

var canonicaliseBody = function(body) {
    return JSON.stringify(JSON.parse(body))
}

module.exports.checkstatus = function checkstatus (req, res, next) {
    auth.validateRequest(req, '').then(function() {
		return Standard.checkstatus()
	}).then(function (response) {
	    utils.writeJson(res, response)
    }).catch(function (err) {
      	utils.writeError(res, err);
    })
}

module.exports.getRecommendationStatus = function getRecommendationStatus (req, res, next) {
    var recId = req.params['recId']
	if(typeof recId === 'undefined') 
		utils.writeError({status: 400, message: 'Missing recommendation id'})
	else {
		console.log('Checking status for '+recId)
		auth.validateRequest(req, '').then(function() {
			return Standard.getRecommendationStatus(recId)
		}).then(function (response) {
			console.log('ok: '+response)
			utils.writeJson(res, response)
		}).catch(function(err) {
			console.log('oops')
			utils.writeError(res, err);
		})
	}
}

module.exports.submitRecommendation = function submitRecommendation (req, res, next) {
    console.log('submit')
    var body = req.body
    console.log(body)
    if(typeof body === 'undefined') {
		utils.writeError(res,{status: 400, message: 'Bad or missing recommendation'})
	} else {
		auth.validateRequest(req, body).then(function() {
			return Standard.submitRecommendation(body)
		}).then(function (response) {
			utils.writeJson(res, response)
		}).catch(function(err) {
			utils.writeError(res, err)
		})
	}
}
