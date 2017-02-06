// Inits the Mongoose DB Connection
var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')

mongoose.connect('mongodb://localhost:27017/test')

var db = mongoose.connection
autoIncrement.initialize(db)

var Review = require('./reviews').Review

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function () {
  var review = new Review({ product: 1, message: 'One of my favorites!', author: 'admin@juice-sh.op' })

  review.save()
})
