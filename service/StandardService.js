'use strict';
const recdb = require('./Recommendation.js')

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
    return new Promise(function(resolve, reject) {
	console.log('in service checking for '+recId)
	var status = recdb.getRecommendationStatus(recId)
	console.log('DB said status is '+status)
	if(status === 'NOTFOUND') {
	    console.log('Rejecting')
	    reject({status: 404, message: 'Unknown recommendation id: '+recId})
	}
	else resolve('{"state": "'+status+'"}');
    });
}


/**
 * submits a recommended action
 * Adds a recommended action for a specified service
 *
 * recommendation Recommendation Recommendation being made (optional)
 * returns RecommendationResponse
 **/
exports.submitRecommendation = function(recommendation) {
    return new Promise(function(resolve, reject) {
	console.log(recommendation)
	var valid= recdb.validateRecommendation(recommendation)
	if(valid == 200) {
	    console.log('Validated ok')
	    var recid = recdb.saveRecommendation(recommendation)
	    console.log('Got recommendation id '+recid)
	    var retval = '{ "recommendation_id" : "' + recid + '"}'
	    recdb.showState()
	    resolve(retval)
	} else {
	    console.log('Failed validation')
	    recdb.showState()
	    reject({status: valid, message: 'Malformed recommendation'});
	}
    });

}
