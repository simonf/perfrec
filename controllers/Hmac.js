'use strict';
const util = require('util')
var utils = require('../utils/writer.js'),
		auth = require('../utils/auth.js'),
		logger = require('../utils/log')


module.exports.calcHMAC = function calcHMAC (req, res, next) {
  var plaintext = ''
	if (typeof req.body.plaintext !== 'undefined') {
		if (typeof req.body.key !== 'undefined') {
			var plaintext = req.body.plaintext
			logger.info('SIGNING: ' + plaintext)
			var sig = auth.signBody(plaintext, req.body.key)
			utils.writeJson(res, '{"signature": "'+sig+'"}' );
		} else {
				utils.writeError(res, {status: 400, message: 'Bad input'});
		}
	} else {
		utils.writeError(res,{status: 400, message: 'Missing body'})
	}
}