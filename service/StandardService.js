'use strict';
const util = require('util')
var models = require('../models')
const request_api = require('./RequestAPI.js')
const service_api = require('./ServiceAPI.js')

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
exports.getRecommendationStatus = function(recId) {
	var stat = ''
	var the_recommendation = null
	console.log('Checking status for '+recId)
	return models.Recommendation.findById(parseInt(recId)).then((rec) => {
		the_recommendation = rec
		return request_api.getRequestStatus(rec.request)
	}).then((status) => {
		stat = status
		console.log('DB said status is '+stat)
		console.log('Updating recommendation status')
		return the_recommendation.update({status: stat})
	}).then(()=>{
		return {state: stat}
  })
}

var calc_chg = function(recommendation) {
    if(recommendation.action === 'INCREASE_BANDWIDTH') return recommendation.bandwidth_change
    if(recommendation.action === 'DECREASE_BANDWIDTH') return (0 - recommendation.bandwidth_change)
    console.log('Unrecognised action: ' + recommendation.action)
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
				console.log('Found an in-progress recommendation')
				throw {status: 409, message: 'Recommendation '+ rec.id + ' is already in progress'}
			}
		})
		console.log('No matching records')
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
exports.submitRecommendation = function(recommendation) {
	var tbw = 999
	return checkExistingRecommendations(recommendation.service_id).then(()=>{
		console.log('Calculating svc bw')
		return service_api.calcBandwidthFlex(recommendation.service_id, calc_chg(recommendation))
	}).then((target_bw) => {
		tbw = target_bw
		console.log('Placing request')
		return request_api.flexBandwidth(recommendation.service_id, target_bw)
	}).then((request_id) => {
		console.log('Saving recommendation')
		let db_recommendation = {service: recommendation.service_id, 
														 bandwidth: ''+tbw, 
														 request: ''+request_id,
														 status: INPROGRESS
														}
		console.log('Request ID: '+request_id)
		return models.Recommendation.create(db_recommendation)
	}).then((r)=>{
		return {recommendation_id: ''+r.dataValues.id}
	})
	// .catch((err) => { 
	// 	console.log('Handling error: '+util.inspect(err))
	// 	throw {status: 400, message: 'Could not save recommendation'}
	// })
}
