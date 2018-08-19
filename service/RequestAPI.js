var request_id = 3

module.exports.getRequestStatus = function(request_id) {
  return new Promise((resolve, reject) => {
    console.log('Checking request with id '+request_id)
    try {
      if (parseInt(request_id) % 2 == 0) {
        console.log('Returning SUCCESS')
        resolve('SUCCESS')
      } else {
        resolve('FAILED')
      }
    } catch(e) {
      reject({status: 500, message: 'Internal error getting request status'})
    }
  })
}

module.exports.flexBandwidth = function(service_id, target_bw) {
  return new Promise((resolve, reject) => {
    if(service_id > 3) reject({status: 400, message: 'Another request is in progress for this service'})
    else resolve(request_id++)
  }) 
}