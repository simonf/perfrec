const Url = require('url')
const crypto = require('crypto-js')
const Base64 = crypto.enc.Base64

var appkeys = {
	'simon': 'simonrocks',
	'test': 'test'
}

var getPath = function(request) {
	var u = Url.parse(request.url)
	return u.path
}

var computeDigest = function(request, key) {
	var path = getPath(request)
	var digest = crypto.HmacSHA256(path, key)
	var auth_header = Base64.stringify(digest)
	console.log('Path ' + path + ' has signature ' + auth_header + ' for key ' + key)
	return auth_header
}

var getAppid = function(request) {
	return request.headers['x-app-id']	
}

var getSignature = function(request) {
	return request.headers['x-app-hash']	
}

var getKeyForAppId = function(appid) {
	return typeof appkeys[appid] === 'undefined' ? null : appkeys[appid]
}

var validateRequest = exports.validateRequest = function(request) {
    var key = getKeyForAppId(getAppid(request))
    var sig = getSignature(request)
    if(!key) {
	console.log('Missing key')
	return 404
    }
    if(!sig) {
	console.log('Missing signature')
	return 403
    }
    console.log('Got key and sig')
    var tgt = computeDigest(request, key)	
    if(tgt !== sig) {
	console.log('Signature ' + sig + ' does not match expectation: ' + tgt)
	return 403
    } else {
	console.log('Sig ok')
	return 200
    }
}
