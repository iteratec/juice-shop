// inits the Mongoose DB Connection
var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')

// telling mongoose to use native promises
// TODO check compatability with older node Versions
mongoose.Promise = global.Promise

mongoose.connect('mongodb://mongodb:27017/test')

var db = mongoose.connection
// using a autoincrement plugin to enable attacks using $gt, $ne ...
autoIncrement.initialize(db)

db.on('open', function () {
  console.log('+-----------------------------------------------------+')
  console.log('|                      Success                        |')
  console.log('|      A MongoDB Server was found in the network      |')
  console.log('|      JuiceShop will automatically run with the      |')
  console.log('|              NoSQL Extension enabled                |')
  console.log('+-----------------------------------------------------+')
})

db.on('error', function () {
  console.log('+-----------------------------------------------------+')
  console.log('|                     Warning                         |')
  console.log('|      No MongoDB Server was found in the network     |')
  console.log('|          This is just an optional feature           |')
  console.log('|  The rest of the JuiceShop will work as exprected   |')
  console.log('+-----------------------------------------------------+')
})

// writing initial data to the collection
db.once('open', require('./datacreator'))
