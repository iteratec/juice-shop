// inits the Mongoose DB Connection
var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')

// telling mongoose to use native promises
// TODO check compatability with older node Versions
mongoose.Promise = global.Promise;

// TODO switch to docker network adress
mongoose.connect('mongodb://localhost:27017/test')

var db = mongoose.connection
// using a autoincrement plugin to enable attacks using $gt, $ne ...
autoIncrement.initialize(db)

var Review = require('./reviews').Review

db.on('error', console.error.bind(console, 'connection error:'))
// writing initial data to the collection
db.once('open', require('./datacreator'))
