var services = {
  '1': { can_flex: true, bw: 100},
  '2': { can_flex: false, bw: 100},
  '3': { can_flex: true, bw: 0},
  '4': { can_flex: true, bw: 0}
}

module.exports.getService = function (custid, service_id) {
  return {id: '1', bandwidth: 100}
}