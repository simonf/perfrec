const Url = require('url')
const crypto = require('crypto-js')
const Base64 = crypto.enc.Base64

const MINUTE_WINDOW = 5

var appkeys = {
    'simon': 'simonrocks',
    'test': 'test'
}

var getPath = function(request) {
    var u = Url.parse(request.url)
    return u.path
}

var getBody = function(request) {
    
}

var calcPreviousHour = function(d,m,y,h) {
    if(h == 0) {
	return calcPreviousDay(d, m, y) + '23'
    } else return formatDate(d,m,y,h-1)
}

var calcPreviousHour = function(d,m,y,h) {
    if(h == 23) {
	return calcNextDay(d,m,y) + '00'
    } else return formatDate(d,m,y,h+1)
}

var calcPreviousDay = function (d, m, y) {
    if(d==1) {
	var prevm = m -1
	if(prevm == 0) return formatDate(31,12,y-1)
	if([9,4,6,11].includes(prevm)) return formatDate(30,prevm,y)
	return formatDate(31,prevm,y)
    }
    return formatDate(d-1,m,y)
}

var calcNextDay = function(d, m, y) {
    if(m == 2) {
	if(y % 4 > 0 && d == 28) return formatDate(1,3,y)
	if(y % 4 == 0 && d == 29) return formatDate(1,3,y)
    }
    if(d == 30 && [4,6,9,11].includes(m)) return formatDate(1,m+1,y) 
    if(d == 31) {
	if(m==12) return formatDate(1,1,y+1)
	return formatDate(1, m+1, y)
    } 
    return formatDate(d+1, m, y)
}

var formatDate = function(day, month, yr, hr) {
    var m = '' + month
    var d = '' + day
    var h = '' + hour
    if(m.length < 2) m = '0' + m
    if(d.length < 2) d = '0' + d
    if(h.length < 2) h = '0' + h
    return(yr+m+d+h) 
}

var getDatestamps = function() {
    var now = new Date()
    var d = now.getDate()
    var m = now.getMonth() + 1
    var yr = now.getFullYear()
    var retval = [formatDate(d,m,yr)]
    var hr = now.getHours()

    var min = now.getMinutes()
    if(min >= 60 - MINUTE_WINDOW) retval.append(calcNextHour(d ,m, yr, hr))
    if(min <= MINUTE_WINDOW) 	retval.append(calcPreviousHour(d, m, yr, hr))

    return retval	
}

var checkSig = function(sig, request, key) {
    console.log('Validating '+sig)
    var ds = getDatestamps()
    return ds.some(function(ds) {
	var mysig = computeDigest(ds, request, key)
	console.log('Checking '+mysig)
	return sig == mysig
    })
}
    
    
var computeDigest = function(datestamp, request, key) {
    var path = getPath(request)
    var body_sig = crypto.HmacSHA256(getBody(request), key)
    var tgt = datestamp+path+body_sig
    var digest = crypto.HmacSHA256(tgt, key)
    var auth_header = Base64.stringify(digest)
    console.log('Path ' + tgt + ' has signature ' + auth_header + ' for key ' + key)
    return auth_header
}

var getAppid = function(request) {
	return request.headers['x-colt-app-id']	
}

var getSignature = function(request) {
	return request.headers['x-colt-app-sig']	
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
    if(!checkSig(sig, request, key)) {
	console.log('Signature ' + sig + ' does not match expectation')
	return 403
    } else {
	console.log('Sig ok')
	return 200
    }
}
