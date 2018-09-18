'use strict';

var utils = require('../utils/writer.js'),
    auth = require('../utils/auth.js'),
    Standard = require('../service/StandardService'),
    Datahub = require('../service/DatahubService'),
    logger = require('../utils/log')


module.exports.checkstatus = function checkstatus (req, res, next) {
    auth.validateRequest(req, '').then(function(user) {
		return Standard.checkstatus()
	}).then(function (response) {
	    utils.writeJson(res, response)
    }).catch(function (err) {
      	utils.writeError(res, err);
    })
}

module.exports.getService = function getService(req, res, next) {
    var svcId = req.params['serviceId']
    if(typeof svcId === 'undefined')
	utils.writeError({status: 400, message: 'Missing service ID'})
    else {
	logger.info('Checking service with ID '+svcId)
//	auth.validateRequest(req,'').then(function(user) {
//	    logger.info('Got user with appid '+user.appid)
//	    if (user.services && user.services.includes(svcId))
//		return Datahub.getAnalytics(svcId)
//	    else throw new Error("You do not have access to that service")
	Datahub.getAnalytics(svcId).then(function(data) {
		     //	}).then(function(data) {
	    logger.info('Returned some data')
	    logger.info(data)
	    res.set('Content-Type','application/json')
	    res.set('Connection','close')
	    res.status(200).json(data)
	}).catch(function (err) {
	    logger.error('Error')
	    utils.writeError(res,err)
	})
    }

}

module.exports.getRecommendationStatus = function getRecommendationStatus (req, res, next) {
    var recId = req.params['recId']
    if(typeof recId === 'undefined') 
	utils.writeError({status: 400, message: 'Missing recommendation id'})
    else {
	logger.info('Checking status for '+recId)
	auth.validateRequest(req, '').then(function(user) {
	    return Standard.getRecommendationStatus(user, recId)
	}).then(function (response) {
	    utils.writeJson(res, response)
	}).catch(function(err) {
	    utils.writeError(res, err)
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
		auth.validateRequest(req, body).then(function(user) {
			return Standard.submitRecommendation(user, body)
		}).then(function (response) {
			utils.writeJson(res, response)
		}).catch(function(err) {
			utils.writeError(res, err)
		})
	}
}
