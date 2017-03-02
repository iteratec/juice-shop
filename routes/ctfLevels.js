'use strict'

var utils = require('../lib/utils')
var challenges = require('../data/datacache').challenges
var Entities = require('html-entities').XmlEntities

var entities = null
var countryCodes = require('../data/countrycodes.js')
var striptags = require('striptags')
var countries = {}
var template = {}

function shuffle (array) {
  var counter = array.length

  // While there are elements in the array
  while (counter > 0) {
        // Pick a random index
    var index = Math.floor(Math.random() * counter)

        // Decrease counter by 1
    counter--

        // And swap the last element with it
    var temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

/**
 * Pushes a single challenge(aka. flag[aka. level]) into the template file
 * @param challenge Object
 */
function pushLevel (challenge) {
  // Strip Tags from the String as they can't be displayed by fbdtf anyway
  var description = striptags(challenge.description)
  // Unencode html entities into the proper chars so the xss script injection challenges are displayed in a better way
  description = entities.decode(description)

  template.levels.levels.push({
    'type': 'flag',
    'title': challenge.name,
    'active': true,
    'description': description,
    'entity_iso_code': randomCountryCodePerDifficulty(challenge.difficulty),
    'category': 'Difficulty ' + challenge.difficulty, // challenge.category,
    'points': challenge.difficulty * 5,
    'bonus': challenge.difficulty * 3,
    'bonus_dec': challenge.difficulty,
    'bonus_fix': 30,
    'flag': utils.toHmac(challenge.name), // Challange Key
    'hint': '',
    'penalty': 0
  })
}

/**
 * Returns a ISO-3166 Country Code corresponding to the Difficulty
 * @param difficulty Number(1 - 5)
 */
function randomCountryCodePerDifficulty (difficulty) {
  var country = countries[difficulty].pop()

  if (country !== undefined) {
    return country['alpha-2']
  }
  // If country is undefined there are not enought Countries in the difficulty
  console.log('Not enought Countries in the Difficulty: ' + difficulty)
  return 'Not enought Countries in the Difficulty: ' + difficulty
}

/**
 * Sorts the Countries into diffrent categories based on their development
 */
function initCountryList () {
  countryCodes = shuffle(countryCodes)

  countryCodes.map(function (country) {
    return country['alpha-2']
  })

  countries[1] = countryCodes.filter(function (country) {
    return country['sub-region'] === 'Western Europe' ||
      country['sub-region'] === 'Northern America' ||
      country['sub-region'] === 'Australia and New Zealand'
  })
  countries[2] = countryCodes.filter(function (country) {
    return country['sub-region'] === 'Eastern Europe'
  })
  countries[3] = countryCodes.filter(function (country) {
    return country['sub-region'] === 'South America' ||
      country['sub-region'] === 'Central America'
  })
  countries[4] = countryCodes.filter(function (country) {
    return country['region'] === 'Asia'
  })
  countries[5] = countryCodes.filter(function (country) {
    return country['region'] === 'Africa'
  })
}

exports = module.exports = function productReviews () {
  return function (req, res, next) {
    // Load the Basic fbctf im/export template in which the challenges will get inserted
    template = require('../data/fbctfImportTemplate')
    // Load a List of all Countries and sort them into categories based on the size and development
    initCountryList()
    entities = new Entities()

    for (var key in challenges) {
      pushLevel(challenges[key])
    }

    // Download the generated File as game.json
    res.attachment('game.json')
    res.end(JSON.stringify(template, null, 2), 'utf8')
  }
}
