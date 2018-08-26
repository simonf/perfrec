var Client = require('node-rest-client').Client
var client = new Client()
var logger = require('../utils/log')
const util = require('util')

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

var initPrices = module.exports.initPrices = function(ocn) {
  if (fs.existsSync('./data/prices.js')) {
      logger.info('Loading prices')
      bw_to_price = require('../data/prices')
  } else {
      logger.info('Falling back on built-in prices')
  }
  appkeys.forEach(element => {
      console.log(element.appid)
  });
}

module.exports.getPrices = function(ocn) {
  return new Promise((resolve, reject) => {
    initPrices(ocn)
    resolve(bw_to_price)
  })
}

module.exports.getPriceId = function(ocn, bw) {
  return new Promise((resolve, reject) => {
    initPrices(ocn)
    resolve(bw_to_price.sort((a,b) => { return a.bw - b.bw }).find((element) => { return element.bw >= target_bw }).price_id)
  })
}

