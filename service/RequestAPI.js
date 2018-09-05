
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
				'Authorization': 'Basic Tm92UmVxdWVzdFVzZXI1OTpOZHhVQ0NkMkZmMzJqa3Zl'
				}
			}	
		    var req = client.get(url, args,function(data, response) {
				if(response.statusCode == 200) resolve(data[0].status)
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
			price_id: price_id,
			customer_currency: user.currency,
			discount_percentage:null,
			bcn: user.bcn,
			portal_user_id: user.portal_user_id,
			a_end_vlan_mapping: null,
			b_end_vlan_mapping: null,
			a_end_vlan_type: null,
			b_end_vlan_type: null,
			a_end_vlan_ids: null,
			b_end_vlan_ids: null,
			customer_name: user.customer_name,
			ocn: user.ocn,
			coterminus_option:false,
			customer_region: user.region,
			pricing_tier: user.pricing_tier
		    }

		    logger.info('New request payload: ' + util.inspect(payload))

			var args = {
				data: payload,
				headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic Tm92UmVxdWVzdFVzZXI1OTpOZHhVQ0NkMkZmMzJqa3Zl'
				}
			}

			var req = client.post(url, args,function(data, response) {
				logger.info(data)
			    if(response.statusCode == 200) {
				if(data < 10) {
				    reject({status: 500, message: 'Internal API call failed with status '+data})
				} else {
				    logger.info('Created request with id '+data)
				    resolve(data)
				}
			    } else {
				logger.error('While creating a BW modification request, status code was '+response.statusCode)
				reject({status:500, message: 'Internal API call returned a response code of '+response.statusCode})			    }
			})

			logger.debug(req.options)
			
			req.on('error', function (err) {
				logger.error(err)
				reject({status: 500, message: 'Internal error'})
			})
		})
	}
}

/* Example modify bw request payload:

{  
  "price_id":147026,
  "customer_currency":"GBP",
  "discount_percentage":null,
  "bcn":"111111",
  "portal_user_id":1,
  "a_end_vlan_mapping":null,
  "b_end_vlan_mapping":null,
  "a_end_vlan_type":null,
  "b_end_vlan_type":null,
  "a_end_vlan_ids":null,
  "b_end_vlan_ids":null,
  "customer_name":"Sundar Expo",
  "ocn":"111111",
  "coterminus_option":false,
  "customer_region":"EU",
  "pricing_tier":"ENT Standard"
}


In dev: 50M DCNET-UK-LON - DCNET-UK-LON is 151097
100M is 151098
150M is 151099

*/
