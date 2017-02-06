var frisby = require('frisby')
// var insecurity = require('../../lib/insecurity')
//
// var API_URL = 'http://localhost:3000/api'
var REST_URL = 'http://localhost:3000/rest'

// var authHeader = { 'Authorization': 'Bearer ' + insecurity.authorize() }

frisby.create('GET product reviews by product id')
  .get(REST_URL + '/product/1/reviews')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('data.*', {
    _id: String,
    id: String,
    msg: String,
    author: String
  })
  .toss()

frisby.create('GET product reviews attack by injecting a mongoDB sleep command')
  .get(REST_URL + '/product/sleep(100)/reviews')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('data.*', {
    _id: String,
    id: String,
    msg: String,
    author: String
  })
  .toss()

frisby.create('PUT single product review can be created')
  .put(REST_URL + '/product/1/reviews', {
    msg: 'Lorem Ipsum',
    author: 'None'
  }, { json: true })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('data', {
    result: Object,
    ops: Array,
    insertedCount: Number,
    insertedIds: Array
  })
  .toss()

  // .expectJSONLength('data', 0)
  // .addHeaders(authHeader)
