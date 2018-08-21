'use strict';
const util = require('util'),
			request_api = require('./RequestAPI.js'),
			service_api = require('./ServiceAPI.js')
var models = require('../models'),
		logger = require('../utils/log')

const INPROGRESS = 'INPROGRESS'

/**
 * checks API availability
 * Send a GET request with your API token to check both that the token is recognised and that the API is up and running 
 *
 * returns Object
 **/
exports.checkstatus = function() {
  return new Promise(function(resolve, reject) {
      resolve('{"status": "OK"}')
  });
}


/**
 * get the state of a previously submitted recommendation
 *
 * recId String 
 * returns RecommendationState
 **/
exports.getRecommendationStatus = function(custid, recId) {
	var stat = ''
	var the_recommendation = null
	logger.info('Checking status for '+recId)
	return models.Recommendation.findById(parseInt(recId)).then((rec) => {
		if (!rec) throw {status: 404, message: 'Recommendation '+recId + ' not found'}
		if (rec.custid != custid) throw {status: 403, message: 'This recommendation was not made by you'}
		the_recommendation = rec
		return request_api.getRequestStatus(rec.request)
	}).then((status) => {
		stat = status
		logger.debug('DB said status is '+stat)
		logger.debug('Updating recommendation status')
		return the_recommendation.update({status: stat})
	}).then(()=>{
		return {state: stat}
  })
}

var calc_chg = function(recommendation) {
    if(recommendation.action === 'INCREASE_BANDWIDTH') return recommendation.bandwidth_change
    if(recommendation.action === 'DECREASE_BANDWIDTH') return (0 - recommendation.bandwidth_change)
    logger.warn('Unrecognised action: ' + recommendation.action)
    return 0
}

var checkExistingRecommendations = function(service_id) {
	return models.Recommendation.findAll({
		where: {
			service: service_id
		}
	}).then((recs) => {
		recs.forEach(element => {
			let rec = element.dataValues
			if (rec.status == INPROGRESS) {
				logger.warn('Found an in-progress recommendation')
				throw {status: 409, message: 'Recommendation '+ rec.id + ' is already in progress'}
			}
		})
		logger.debug('No matching records')
		return
	})
}
/**
 * submits a recommended action
 * Adds a recommended action for a specified service
 *
 * recommendation Recommendation Recommendation being made (optional)
 * returns RecommendationResponse
 **/
exports.submitRecommendation = function(custid, recommendation) {
	var tbw = 999
	return checkExistingRecommendations(recommendation.service_id).then(()=>{
		logger.debug('Calculating svc bw')
		return service_api.calcBandwidthFlex(recommendation.service_id, calc_chg(recommendation))
	}).then((target_bw) => {
		tbw = target_bw
		logger.debug('Placing request')
		return request_api.flexBandwidth(custid, recommendation.service_id, target_bw)
	}).then((request_id) => {
		logger.debug('Saving recommendation')
		let db_recommendation = {custid: custid,
														 service: recommendation.service_id, 
														 bandwidth: ''+tbw, 
														 request: ''+request_id,
														 status: INPROGRESS
														}
		logger.info('Request ID: '+request_id)
		return models.Recommendation.create(db_recommendation)
	}).then((r)=>{
		return {recommendation_id: ''+r.dataValues.id}
	})
}
