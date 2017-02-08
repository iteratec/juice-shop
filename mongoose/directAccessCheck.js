var Secret = require('./secrets').Secret

var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges

module.exports = function (req, res, next) {
  Secret.find({}).then(function (result) {
    if(result.length > 1){
      if (utils.notSolved(challenges.noSqlDirectAccess)) {
        utils.solve(challenges.noSqlDirectAccess)
      }
    }
  })

  next()
}
