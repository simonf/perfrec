var Client = require('node-rest-client').Client
var client = new Client()
var logger = require('../utils/log')
const util = require('util')

const REQUEST_GET_API='http://amsnov03:8330/request-api/api/requests/'
const REQUEST_POST_API='http://amsnov03:8330/request-api/api/requests/updateconnection/'

var request_id = 3

var bw_to_price = [
    {bw: 10, price_id: 103696},
    {bw: 50, price_id: 103697},
    {bw: 100, price_id: 103698},
    {bw: 200, price_id: 103699},
    {bw: 300, price_id: 103700},
    {bw: 400, price_id: 103701},
    {bw: 500, price_id: 103702},
    {bw: 1000, price_id: 103703}
]


module.exports.getRequestStatus = function(request_id) {
    return new Promise((resolve, reject) => {
	var url = REQUEST_GET_API+request_id
	
	logger.info('Checking request with id '+request_id)
	var args = {
	    headers: {
		'Accept': 'application/json',
		'Authorization': 'Basic Tm92U2VydkludlVzZXI1OTpOZHhVQ0NkMkZmMzJqa3Zl'
	    }
	}	
	var req = client.get(url, args,function(data, response) {
	    logger.info(data)
	    if(response.statusCode == 200) resolve(data)
	    else reject({status:500, message: 'Internal API call returned a response code of '+response.statusCode})
	})

	req.on('error', function (err) {
	    logger.error(err)
	    reject({status: 500, message: 'Internal error'})
	})		    
    })
}

module.exports.flexBandwidth = function(user, service_id, target_bw) {
    return new Promise((resolve, reject) => {
	var url = REQUEST_POST_API+service_id+'?customerid='+user.custid

	var prices = initPrices()
	var price_id = prices.sort((a,b) => { return a.bw - b.bw }).find((element) => { return element.bw >= target_bw }).price_id
		     

	var payload = {
	    priceId: price_id,
	    ocn: user.ocn
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
	    if(response.statusCode == 200) resolve(data)
	    else reject({status:500, message: 'Internal API call returned a response code of '+response.statusCode})
	})

	logger.debug(req.options)
	
	req.on('error', function (err) {
	    logger.error(err)
	    reject({status: 500, message: 'Internal error'})
	})		    
    })
}

var initPrices = module.exports.initPrices = function() {
    if (fs.existsSync('./data/prices.js')) {
        logger.info('Loading prices')
        appkeys = require('../data/prices')
    } else {
        logger.info('Falling back on built-in prices')
    }
    appkeys.forEach(element => {
        console.log(element.appid)
    });
}
