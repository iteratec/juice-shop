'use strict'

var utils = require('../lib/utils')

var MongoClient = require('mongodb').MongoClient

// Mongo Connection URL
var url = 'mongodb://127.0.0.1:27017/test'

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    // Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
      if (err !== null) {
        res.json({error: 'Could not connect to MongoDB'})
      }

      // Merge the the msg and author into one object
      var review = Object.assign(req.params, req.body)

      db.collection('product-reviews').insert(review, function (err, result) {
        if (err !== null) {
          res.json({error: 'Could not connect to MongoDB'})
        }
        res.json(utils.queryResultToJson(result))
      })

      db.close()
    })
  }
}
