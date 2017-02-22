var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment')

var path = require('path')
var mongod = require('mongodb-prebuilt')

var dbPath = path.join(__dirname, 'data')

mongod.start_server({
  args: {
    storageEngine: 'ephemeralForTest',
    bind_ip: '127.0.0.1',
    port: 27017,
    dbpath: dbPath
  },
  auto_shutdown: true
},
  function (err) {
    if (err) {
      console.log('mongod didnt start:', err)
    } else {
      console.log('mongod is started')
    }
  })

// telling mongoose to use native promises
// TODO check compatability with older node Versions
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/test')

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
