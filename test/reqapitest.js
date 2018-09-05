var request = require('../service/RequestAPI')
var assert = require('assert')
var user =  require('../data/keys')[2]


describe('RequestAPI', function() {
    describe('getRequestStatus', function() {
	xit('should get status for a valid request ID', function() {
	    assert(process.env.NODE_ENV == 'test')
	    request.getRequestStatus('22759').then((status) => {
		console.log('Status:\n------- ')
		console.log(status)
		assert(status == 'COMPLETED')
	    }).catch((err) => {
		console.log(err)
		assert(false)
	    })
	})
	xit('should return an error if an invalid request ID is specified', function(){
    	    assert(process.env.NODE_ENV == 'test')
	    request.getRequestStatus('saddfas').then((status) => {
		console.log(status)
		assert(false)
	    }).catch((err) => {
		console.log(err)
		assert(err.code == 404)
	    })
	})
    })
    describe('flexBandwidth', function() {
	it('should create a request', function() {
	    // 147025 is 50M international
	    
	    request.flexBandwidth(user, '8000147', 50, 151098).then((reqid) => {
		console.log('Request ID: ' + reqid)
		assert(true)
	    }).catch((err) => {
		console.log(err)
		assert(false)
	    })
	})
    })
})

