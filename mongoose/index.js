var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')
var path = require('path')
var MongodHelper = require('mongodb-prebuilt').MongodHelper

var dbPath = path.join(__dirname, 'data')
var mongodHelper = new MongodHelper(['--port', '1337', '--dbpath', dbPath, '--bind_ip', '0.0.0.0'])
var mongoUrl = 'mongodb://0.0.0.0:1337/test'

var connect = function () {
  return mongoose.connect(mongoUrl).catch(function () {
    console.error('Failed to connect to mongodb')
  })
}

mongodHelper.run().then(function (started) {
  connect()
}, function (e) {
  console.log('error starting', e)
})

// telling mongoose to use native promises
mongoose.Promise = global.Promise

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
  console.log('|  The rest of the JuiceShop will work as expected    |')
  console.log('+-----------------------------------------------------+')
})

// writing initial data to the collection
db.once('open', require('./datacreator'))
