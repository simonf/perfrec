'use strict';

var utils = require('../utils/writer.js');
var auth = require('../utils/auth.js');


module.exports.calcHMAC = function calcHMAC (req, res, next) {
    var plaintext = ''
    var reqplain = req.body.plaintext
    if(typeof reqplain !== 'undefined') {
	// There are 2 use cases:
	// 1. We are being given some escaped JSON
	// 2. We are being given something else
	// Either way we should remove white space
	console.log('GOT: '+ reqplain)

	plaintext = reqplain.replace(/\s/g,'')
	console.log('PARSED:' + plaintext)
//	plaintext = reqplain
    }
    if(typeof req.body.key !== 'undefined') {
	console.log('CALLING: ' + plaintext)
	var sig = auth.calcHMAC(plaintext, req.body.key)
	utils.writeJson(res, '{"signature": "'+sig+'"}' );
    } else {
      	utils.writeError(res, {status: 400, message: 'Bad input'});
    }
};

