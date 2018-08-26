
const util = require('util')

var Client = require('node-rest-client').Client
var client = new Client()
var logger = require('../utils/log'),
	env = process.env.NODE_ENV || 'development',
	config = require('../config/config_env')[env]


var request_id = 3

module.exports.getRequestStatus = function(request_id) {
	if (config.mock) {
		return new Promise((resolve, reject) => {
			resolve('COMPLETE')
		})
	} else {
		return new Promise((resolve, reject) => {
			var url = config.REQUEST_GET_API+request_id
			logger.debug('Calling '+url)
			logger.info('Checking request with id '+request_id)

			var args = {
				headers: {
				'Accept': 'application/json',
				'Authorization': 'Basic Tm92U2VydkludlVzZXI1OTpOZHhVQ0NkMkZmMzJqa3Zl'
				}
			}	
			var req = client.get(url, args,function(data, response) {
				logger.info(data)
				if(response.statusCode == 200) resolve(data.status)
				else reject({status:500, message: 'Internal API call returned a response code of '+response.statusCode})
			})

			req.on('error', function (err) {
				logger.error(err)
				reject({status: 500, message: 'Internal error'})
			})		    
		})
	}
}

module.exports.flexBandwidth = function(user, service_id, target_bw, price_id) {
	if(config.mock) {
		return new Promise((resolve, reject) => {
			resolve(1)
		})
	} else {
		return new Promise((resolve, reject) => {
			var url = config.REQUEST_POST_API+service_id+'?customerid='+user.custid
			logger.debug('POSTing '+url)
			var payload = {
				priceId: price_id,
				ocn: user.ocn,
				customerCurrency: user.currency,
				discountPercentage: 0.0,
				customer_region:user.region,
				pricing_tier: user.pricing_tier,
				customerName: user.customer_name,
				bandwidth: ''+target_bw
			}
			logger.info('New request payload: ' + util.inspect(payload))

			var args = {
				data: payload,
				headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic Tm92U2VydkludlVzZXI1OTpOZHhVQ0NkMkZmMzJqa3Zl'
				}
			}

			var req = client.post(url, args,function(data, response) {
				logger.info(data)
				if(response.statusCode == 200) resolve(data.request_id)
				else reject({status:500, message: 'Internal API call returned a response code of '+response.statusCode})
			})

			logger.debug(req.options)
			
			req.on('error', function (err) {
				logger.error(err)
				reject({status: 500, message: 'Internal error'})
			})
		})
	}
}
