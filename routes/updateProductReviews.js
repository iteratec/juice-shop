'use strict'

var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges

var insecurity = require('../lib/insecurity')

var connection = require('mongoose').connection
var Review = require('../mongoose/reviews').Review

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    var id = req.body.id
    var user = insecurity.authenticatedUsers.from(req)

    if (!insecurity.isAuthorized() || user === null) {
      res.status(401).json({msg: 'You need to be authorized to do this!'})
      return
    }

    if (connection.readyState === 1) {
      // Check weather the user is allowed to update the reviews
      Review.find({_id: id}).then(function (reviews) {
        if (reviews.length === 0) {
          res.status(401).json({msg: 'You are only allowed to edit your own comments!'})
        } else {
          // Updates the comments
          // insecurity as it updates all the comments and doesnt filter for the user
          // also updateOne() or findOneAndUpdate() would be more suitible here
          Review.updateMany({_id: id}, {message: req.body.message}, {runValidators: false})
          .then(function (result) {
            if (result.nModified > 1) {
              //More then one Review was modified => challange solved
              if (utils.notSolved(challenges.noSqlInjectionChallenge)) {
                utils.solve(challenges.noSqlInjectionChallenge)
              }
            }
            res.json(result)
          }, function (err) {
            res.status(500).json(err)
          })
        }
      }, function (err) {
        console.log(err)
      })
    } else {
      res.json({msg: 'No NoSQL Database availible'})
    }
  }
}
