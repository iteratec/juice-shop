var frisby = require('frisby')

var REST_URL = 'http://localhost:3000/rest'

frisby.create('GET product reviews by product id')
  .get(REST_URL + '/product/1/reviews')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('data.*', {
    _id: Number,
    product: Number,
    message: String,
    author: String
  })
  .toss()

frisby.create('GET product reviews attack by injecting a mongoDB sleep command')
  .get(REST_URL + '/product/sleep(100)/reviews')
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('data.*', {
    _id: Number,
    product: Number,
    message: String,
    author: String
  })
  .toss()

frisby.create('PUT single product review can be created')
  .put(REST_URL + '/product/1/reviews', {
    message: 'Lorem Ipsum',
    author: 'Anonymous'
  }, { json: true })
  .expectStatus(200)
  .expectHeaderContains('content-type', 'application/json')
  .expectJSONTypes('data', {
    _id: Number,
    product: Number,
    message: String,
    author: String
  })
  .toss()

  // .expectJSONLength('data', 0)
  // .addHeaders(authHeader)
