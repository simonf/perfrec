var recommendation_db = {
    latest_id: 1,
    db: {},
    save: function(r) {
	this.latest_id +=1
	db[latest_id+''] = r
    },
    get: function(id) {
	return db[id]
    }
}


module.exports.validateRecommendation = function(recommendation) {
    return 200
}

module.exports.saveRecommendation = function(recommendation) {
    return 'newid'
}

