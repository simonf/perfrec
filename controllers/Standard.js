'use strict';

var utils = require('../utils/writer.js'),
	auth = require('../utils/auth.js'),
	Standard = require('../service/StandardService'),
	logger = require('../utils/log')


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
		logger.info('Checking status for '+recId)
		auth.validateRequest(req, '').then(function(appid) {
			return Standard.getRecommendationStatus(appid, recId)
		}).then(function (response) {
			utils.writeJson(res, response)
		}).catch(function(err) {
			utils.writeError(res, err);
		})
	}
}

module.exports.submitRecommendation = function submitRecommendation (req, res, next) {
    logger.info('submit')
    var body = req.body
    logger.debug(body)
    if(typeof body === 'undefined') {
		utils.writeError(res,{status: 400, message: 'Bad or missing recommendation'})
	} else {
		auth.validateRequest(req, body).then(function(appid) {
			return Standard.submitRecommendation(appid, body)
		}).then(function (response) {
			utils.writeJson(res, response)
		}).catch(function(err) {
			utils.writeError(res, err)
		})
	}
}
