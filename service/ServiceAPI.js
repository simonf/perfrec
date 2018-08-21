const util = require('util')
var Client = require('node-rest-client').Client
var client = new Client()
var logger = require('../utils/log')

const MIN_BANDWIDTH = 0
const MAX_BANDWIDTH = 1000

const SERVICE_API='http://amsnov03:8330/service-inventory/api/connection/'
// sample connection id: 80008581


var service_api = {
    services: {
      '1': { can_flex: true, bw: 100},
      '2': { can_flex: false, bw: 100},
      '3': { can_flex: true, bw: 0},
      '4': { can_flex: true, bw: 0}
    },
    getService: function(custid, service_id) {
	var args = {
	    headers: { 
		'Authorization': 'Basic Tm92U2VydkludlVzZXI1OTpOZHhVQ0NkMkZmMzJqa3Zl'
	    }
	}
	var url = SERVICE_API+service_id
	return new Promise((resolve, reject) => {
	    let req = client.get(url, args, (data, response) => {
		logger.debug(data)
		if (data.ocn != ''+custid) reject({status: 403, message: 'You are not allowed to update that service'})
		resolve({id: data.connection_id, bandwidth: data.bandwidth})
	    })
	    req.on('error', (err) => {
		logger.error(err)
		reject({status: 500, message: 'Unable to validate the service ID because of an internal error'})
	    })
	})
	
    },
    getServiceOld: function(custid, service_id) {
        return new Promise((resolve, reject) => {
            /// When integrating, check custid
            let svc = this.services[service_id]
            if (typeof svc !== 'undefined') {
                logger.debug('Service found. Resolving')
                resolve({id: service_id, bandwidth: svc.bw})
            } else {
                logger.debug('Unrecognised service. Rejecting')
                reject({status: 404, message: 'Service not found'}) 
            } 
        })
    },
    calculateTargetBandwidth: function(custid, service_id, bw_change) {
        return this.getService(custid, service_id).then((svc) => {
            let target_bw = svc.bandwidth + bw_change
            if (target_bw < MIN_BANDWIDTH || target_bw > MAX_BANDWIDTH) {
                logger.info('Bandwidth outside limits. Throwing error')
                throw {status: 400, message: 'Invalid bandwidth change'}
            }
            return target_bw
        })
    }
}

module.exports.calcBandwidthFlex = function(custid, service_id, bw_change) {
    logger.info('Validating bandwidth flex')
    return service_api.calculateTargetBandwidth(custid, service_id, bw_change)
}


//// Service API returns this payload:
/*
{
    "nms": null,
    "connection_id": "80008581",
    "name": "SDConn_23072018_01",
    "from_port_name": "SDPort_23072018_01",
    "to_port_name": "SDPort_23072018_02",
    "bandwidth": 50,
    "created_date": "2018-08-21T08:29:58+0000",
    "last_updated": "2018-08-21T10:35:32+0000",
    "decommissioned_on": "",
    "status": "ACTIVE",
    "rental_charge": 0.34,
    "rental_unit": "HOURLY",
    "rental_currency": "GBP",
    "from_port_id": "80008579",
    "to_port_id": "80008580",
    "service_id": "10",
    "resource_id": null,
    "from_latlong": {
        "latitude": 51.499805,
        "longitude": -0.011067
    },
    "to_latlong": {
        "latitude": 51.907894,
        "longitude": 0.3399653
    },
    "a_end_vlan_mapping": "F",
    "b_end_vlan_mapping": "F",
    "a_end_vlan_type": "S",
    "b_end_vlan_type": "S",
    "a_end_vlan_ids": [
        {
            "cloud": false,
            "from_id_range": 30,
            "to_id_range": 30
        }
    ],
    "b_end_vlan_ids": [
        {
            "cloud": false,
            "from_id_range": 30,
            "to_id_range": 30
        }
    ],
    "customer_name": "Automation EU GBP",
    "ocn": "000010",
    "sla_id": "SLA_01",
    "penalty_charge": 2977.3801,
    "commitment_period": 12,
    "commitment_expiry_date": "2019-08-21T08:59:59+0000",
    "connection_type": "DCNCONNECTION",
    "enni_colt_port": null,
    "enni_olo_port": null,
    "enni_vlan": null,
    "olo_service_id": null,
    "last_olo_order_id": null,
    "nc_tech_service_id": "93a1c854-a359-4290-882a-19d544e265b6",
    "cease_request_id": "26815"
}
*/
