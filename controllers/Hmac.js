'use strict';
const util = require('util')
var utils = require('../utils/writer.js'),
		auth = require('../utils/auth.js'),
		logger = require('../utils/log')

var pad2 = function(ival) {
	if (ival < 10) return '0' +ival
	else return '' + ival
}

module.exports.calcHMAC = function calcHMAC (req, res, next) {
  var plaintext = ''
	if (typeof req.body.plaintext !== 'undefined') {
		if (typeof req.body.key !== 'undefined') {
			var plaintext = req.body.plaintext
			logger.info('SIGNING body ' + plaintext)
			var body_sig = auth.signBody(plaintext, req.body.key)
			if (typeof req.body.path != 'undefined') {
				var path = req.body.path
				let dt = new Date()
				var hourstamp = '' +
												dt.getFullYear() +
												pad2(dt.getMonth()+1) +
												pad2(dt.getDate()) +
												pad2(dt.getHours())
				logger.info('SIGNING ' + hourstamp + ' with path ' + path + ' and hash ' + body_sig)
				var full_sig = auth.signBody(hourstamp+path+body_sig, req.body.key)
				utils.writeJson(res, {signature: full_sig})
			} else {
				logger.warn('Signing payload without a path or timestamp')
				utils.writeJson(res, {signature: body_sig})
			}
		} else {
				utils.writeError(res, {status: 400, message: 'No key supplied'});
		}
	} else {
		utils.writeError(res,{status: 400, message: 'Missing body'})
	}
}