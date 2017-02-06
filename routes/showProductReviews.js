'use strict'

var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    var id = req.params.id

    if (req.app.locals.noSqlEnabled) {
      // Use connect method to connect to the server
      MongoClient.connect(req.app.locals.mongoAdress, function (err, db) {
        if (err) {
          res.json({error: 'Could not connect to MongoDB'})
        }
        assert.equal(null, err)

        // Messure how long the query takes to find out if an there was a nosql dos attack
        var t0 = new Date().getTime()

        db.collection('product-reviews').find({'$where': 'this.id == ' + id}).toArray(function (err, docs) {
          if (err) {
            res.json({error: 'Database in in a wrong format'})
          }

          var t1 = new Date().getTime()

          if ((t1 - t0) > 2000) {
            if (utils.notSolved(challenges.noSqlJavaScriptChallenge)) {
              utils.solve(challenges.noSqlJavaScriptChallenge)
            }
          }
          res.json(utils.queryResultToJson(docs))
        })

        db.close()
      })
    } else {
      res.json({msg: 'No NoSQL Database availible'})
    }
  }
}
