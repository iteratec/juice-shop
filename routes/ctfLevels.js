'use strict'

var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges
var Entities = require('html-entities').XmlEntities

var entities = null
var striptags = require('striptags')
var template = {}

/**
 * Pushes a single challenge(aka. flag[aka. level]) into the template file
 * @param challenge Object
 */
function pushLevel (challenge) {
  // Strip Tags from the String as they can't be displayed by fbctf anyway
  var description = striptags(challenge.description)
  // Unencode html entities into the proper chars so the xss script injection challenges are displayed in a better way
  description = entities.decode(description)

  template.levels.levels.push({
    'type': 'flag',
    'title': challenge.name,
    'active': true,
    'description': description,
    'entity_iso_code': challenge.countryCode,
    'category': 'Difficulty ' + challenge.difficulty, // challenge.category,
    'points': challenge.difficulty * 5,
    'bonus': challenge.difficulty * 3,
    'bonus_dec': challenge.difficulty,
    'bonus_fix': 30,
    'flag': utils.toHmac(challenge.name), // Challenge Key
    'hint': '',
    'penalty': 0,
    'links': [],
    'attachments': []
  })
}

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    // Load the Basic fbctf im/export template in which the challenges will get inserted
    template = require('../data/fbctfImportTemplate')
    // Load a List of all Countries and sort them into categories based on the size and development
    entities = new Entities()

    for (var key in challenges) {
      pushLevel(challenges[key])
    }

    // Download the generated File as game.json
    res.attachment('game.json')
    res.end(JSON.stringify(template, null, 2), 'utf8')
  }
}
