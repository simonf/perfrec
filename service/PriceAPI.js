var Client = require('node-rest-client').Client
var client = new Client()
var logger = require('../utils/log')
const util = require('util')
const fs = require('fs')

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
  logger.debug('Initialising prices')
  if (fs.existsSync('./data/prices.js')) {
      logger.info('Loading prices')
      bw_to_price = require('../data/prices')
  } else {
      logger.info('Falling back on built-in prices')
  }
}

module.exports.getPrices = function(ocn) {
  return new Promise((resolve, reject) => {
    initPrices(ocn)
    resolve(bw_to_price)
  })
}

module.exports.getPriceId = function(ocn, bw) {
  logger.debug('looking for a price')
  return new Promise((resolve, reject) => {
    initPrices(ocn)
    var sorted_bw = bw_to_price.sort((a,b) => { return a.bw - b.bw })
    var closest_price = sorted_bw.find((element) => { return element.bw >= bw })
    logger.info('Bandwidth '+bw+' corresponds to price id '+closest_price.price_id)
    resolve(closest_price.price_id)
  })
}

