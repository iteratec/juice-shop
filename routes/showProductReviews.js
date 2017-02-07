'use strict'

var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges

var connection = require('mongoose').connection
var Review = require('../mongoose/reviews').Review

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    var id = req.params.id

    if (connection.readyState === 1) {
      // Messure how long the query takes to find out if an there was a nosql dos attack
      var t0 = new Date().getTime()
      Review.find({'$where': 'this.product == ' + id}, function (err, reviews) {
        if (err) {
          res.json({error: 'Database in in a wrong format'})
        }

        // If the DB Query takes longer then 2Sec, we can assume that some sort of dos attack was involved
        if ((new Date().getTime() - t0) > 2000) {
          if (utils.notSolved(challenges.noSqlCommandChallenge)) {
            utils.solve(challenges.noSqlCommandChallenge)
          }
        }
        res.json(utils.queryResultToJson(reviews))
      })
    } else {
      res.json({msg: 'No NoSQL Database availible'})
    }
  }
}
