const util = require('util')

var recommendation_db = {
    latest_id: 1,
    db: {
	'1': {'service_id': '1', 'status': 'PENDING'}
    },
    save: function(r) {
	this.latest_id +=1
	this.db[this.latest_id+''] = r
	console.log('New recommendation ID: ' + this.latest_id)
	return this.latest_id+''
    },
    get: function(id) {
	var r =  this.db[id]
	if(typeof r === 'undefined') {
//	    console.log('not found: recommendation with id '+id)
	    return null
	}
	else {
//	    console.log('found: '+r)
	    return r
	}
    }
}

var service_db = {
    services: {
	'1': { can_flex: true, bw: 100},
	'2': { can_flex: false, bw: 100},
	'3': { can_flex: true, bw: 0}
    },
    is_service: function(id) { return typeof this.services[id] !== 'undefined' },
    can_flex: function(id,val) {
	var svc = this.services[id]
	if(!!svc && svc.can_flex) return true
	return false
    },
    do_flex: function(id, val) {
	var svc = this.services[id]
	if(!!svc && svc.can_flex && svc.bw + val >= 0) {
	    svc.bw += val
	    return true
	} else {
	    console.log('Rejecting change')
	    return false
	}
    }
}

var calc_chg = function(recommendation) {
    if(recommendation.action === 'INCREASE_BANDWIDTH') return recommendation.bandwidth_change
    if(recommendation.action === 'DECREASE_BANDWIDTH') return (0 - recommendation.bandwidth_change)
    console.log('Unrecognised action: ' + recommendation.action)
    return 0
	
}

module.exports.validateRecommendation = function(recommendation) {
//    console.log('Validating...')
//    console.log(recommendation)
    showState()
    // bandwidth change is not mandatory in the swagger but is required for now because only this kind of
    // action is allowed
    if(!recommendation.bandwidth_change) {
	console.log('Missing bandwidth_change')
	return 400
    } else {
//	console.log('bandwidth_change is present - ok')
    }

    var current_rec = recommendation_db.get(recommendation.service_id)
    if(current_rec) {
//	console.log('Matching rec: ' + current_rec)
	if(current_rec.status == 'PENDING') {
	    console.log('Found a PENDING recommendation for the same service')
	    return 409
	} else {
//	    console.log('Found earlier recommendations for this service. Continuing')
	}
    } else {
//	console.log('No earlier recommendations for this service')
    }

    if(!service_db.is_service(recommendation.service_id)) {
	console.log('Cannot find a service with id '+recommendation.service_id)
	return 404
    } else {
//	console.log('Found service with id '+recommendation.service_id)
    }
    console.log('All looks good. returning 200')
    return 200
}

module.exports.saveRecommendation = function(recommendation) {
    console.log('save: '+util.inspect(recommendation))
    var chg = calc_chg(recommendation)
    console.log('bw change: '+chg)
		
    recommendation['status'] = 'PENDING'

    if(!service_db.can_flex(recommendation.service_id, chg)) {
	console.log('flex not allowed for service '+recommendation.service_id)
	recommendation['status'] = 'REJECTED'
    }
    else {
	console.log('flex allowed')
	if(service_db.do_flex(recommendation.service_id, chg)) {
	    console.log('flex succeeded for service '+recommendation.service_id)
	    recommendation['status'] = 'SUCCESS'
	}
	else {
	    console.log('flex failed for service '+recommendation.service_id)
	    recommendation['status'] = 'FAILED'
	}
    }
    console.log('Saving '+recommendation)
    return recommendation_db.save(recommendation)
}

module.exports.getRecommendationStatus = function(recid) {
    let stat = recommendation_db.get(recid)
    return stat ? stat.status : 'NOTFOUND'
}

var showState = module.exports.showState = function() {
    console.log('Services')
    console.log(service_db.services)
    console.log('------------')
    console.log('Recommendations')
    console.log(recommendation_db.db)
}

