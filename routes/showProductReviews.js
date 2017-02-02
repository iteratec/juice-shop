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
      assert.equal(null, err);

      //Messure how long the query takes to find out if an there was an attack
      var t0 = new Date().getTime();
      db.collection('product-reviews').find({'$where': 'this.id == ' + id}).toArray(function(err, docs) {
        var t1 = new Date().getTime();

        if((t1 - t0) > 2000){
          if (utils.notSolved(challenges.noSqlJavaScriptChallenge)) {
            utils.solve(challenges.noSqlJavaScriptChallenge)
          }
        }
        res.json(utils.queryResultToJson(docs))
      });



      db.close()
    });

  }
}
