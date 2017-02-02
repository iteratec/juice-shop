'use strict'

var utils = require('../lib/utils')
var insecurity = require('../lib/insecurity')
var models = require('../models/index')
var challenges = require('../data/datacache').challenges

var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

// Mongo Connection URL
var url = 'mongodb://127.0.0.1:27017/test';

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    var id = req.params.id;

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err)

      //Merge the the msg and author into one object
      var review = Object.assign(req.params, req.body);

      db.collection('product-reviews').insert(review, function(err, result) {
        assert.equal(err, null)
        res.json(utils.queryResultToJson(result))
      });

      db.close()
    });

  }
}
