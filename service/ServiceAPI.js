var logger = require('../utils/log')

const MIN_BANDWIDTH = 0
const MAX_BANDWIDTH = 1000

var service_api = {
    services: {
      '1': { can_flex: true, bw: 100},
      '2': { can_flex: false, bw: 100},
      '3': { can_flex: true, bw: 0},
      '4': { can_flex: true, bw: 0}
    },
    getService: function(service_id) {
        return new Promise((resolve, reject) => {
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
    calculateTargetBandwidth: function(service_id, bw_change) {
        return this.getService(service_id).then((svc) => {
            let target_bw = svc.bandwidth + bw_change
            if (target_bw < MIN_BANDWIDTH || target_bw > MAX_BANDWIDTH) {
                logger.info('Bandwidth outside limits. Throwing error')
                throw {status: 400, message: 'Invalid bandwidth change'}
            }
            return target_bw
        })
    }
}

module.exports.calcBandwidthFlex = function(service_id, bw_change) {
    logger.info('Validating bandwidth flex')
    return service_api.calculateTargetBandwidth(service_id, bw_change)
}