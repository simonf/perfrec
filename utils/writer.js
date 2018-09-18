var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}

exports.writeError = function(res, err) {
  if(!err.status) err.status = 400
  if(!err.message) err.message = 'Unknown error'
  var payload = JSON.stringify(err, null, 2);
  res.writeHead(err.status, {'Content-Type': 'application/json', 'Content-Length': payload.length, 'Connection': 'close'});
  res.end(payload);

}
    
exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

var writeJson = exports.writeJson = function(response, arg1, arg2) {
  var code;
  var payload;

  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if(code && arg1) {
    payload = arg1;
  }
  else if(arg1) {
    payload = arg1;
  }

  if(!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  response.writeHead(code, {'Content-Type': 'application/json', 'Content-Length': payload.length, 'Connection': 'close'});
  response.end(payload);
}
