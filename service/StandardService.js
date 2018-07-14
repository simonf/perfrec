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
      resolve('{ "status": "ok"}')
//    } else {
//      reject(403);
//    }
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
    var examples = {};
    examples['application/json'] = {
  "state" : { }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
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
	var valid= recdb.validateRecommendation(recommendation)
	if(valid == 200) {
	    recid = recdb.saveRecommendation(recommendation)
	    retval = '{ "recommendation_id" : "' + recid + '"}'
	    resolve(retval)
	} else {
	    reject(valid);
	}
    });

}
