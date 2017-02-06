'use strict'

var insecurity = require('../lib/insecurity')

var Review = require('../mongoose/reviews').Review

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    var id = req.body.id
    var user = insecurity.authenticatedUsers.from(req)

    if (!insecurity.isAuthorized() || user === null) {
      res.status(401).json({msg: 'You need to be authorized to do this!'})
      return
    }

    if (req.app.locals.noSqlEnabled) {
      // Check weather the user is allowed to update the reviews
      Review.find({_id: id}).then(function (reviews) {
        if (reviews.length === 0) {
          res.status(401).json({msg: 'You are only allowed to edit your own comments!'})
        } else {
          // Updates the comments
          // insecurity as it updates all the comments and doesnt filter for the user
          // also updateOne() or findOneAndUpdate() would be more suitible here
          Review.updateMany({_id: id}, {message: req.body.message}, {runValidators: false}, function (err, reviews) {
            if (!err) {
              res.json(reviews)
            } else {
              res.status(500).json(err)
            }
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
