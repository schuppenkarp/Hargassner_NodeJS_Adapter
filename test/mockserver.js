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

module.exports = {
  start: (port, callback) => {
    server.listen(port, callback);
  },
  server
};
