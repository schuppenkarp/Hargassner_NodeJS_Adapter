var net = require('net')

// Mocks a Hargassner boiler with dummy data
var server = net.createServer(function (client) {
  client.setEncoding('utf-8')
  client.setTimeout(10000)

  setInterval(() => {
    // Unique dummy data from file
    const cases = require('./cases.json')
    var dat = cases[0]["raw"]
    client.write(dat)
  }, 500)
})
server.listen(23)

// Deploys Hargassner package against mock server
var Hargassner = require('hargassner_telnet')
var Zentralheizung = new Hargassner({
  IP: 'localhost',
  PORT: 23
})

Zentralheizung.connect()

Zentralheizung.on('data', (data) => {
  console.log(data)

  // Comment this to test locally and view data in browser
  process.exit()
})

// Small example to get data with a Express Server
var PORT = 3000
var LISTENADRESS = '0.0.0.0'

var express = require('express')
var app = express()

// View parsed data in local browser
app.get('/', function (req, res) {
  res.send(Zentralheizung.data)
})

// View raw data in local browser
app.get('/raw', function (req, res) {
  res.send(Zentralheizung.raw)
})

app.listen(PORT, LISTENADRESS)
