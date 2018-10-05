// Import net module.
var net = require('net');

var server = net.createServer(function(client) {
    client.setEncoding('utf-8');
    client.setTimeout(10000);

    setInterval(() => {
        var dat = "pm 5 7.9 7.6 71.8 78.0 122.1 63 63 39 38 90 71 1 101 75 1028 528 7 0 7 16.8 14.5 52.1 51.3 49.0 120.0 65.3 65.1 0 27 -20.0 0 20.0 -20.0 0 25.3 25.1 0 0 24.9 24.8 50.5 55 25.9 27.9 0 0 21.8 20.0 50.5 60 -20.0 -20.0 0 0 20.0 20.0 -20.0 0 20.0 18.9 17.6 19.6 22.0 20.0 20.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0 0 0 0 0 0 0 0 1 6 0 0 0 0 0 0 0 0 0 1 1 0 3 78 0 0 -0 20 16 0.0 0.0 0.0 0.0 1000.0 75 92 13.9 100.0 0 1880.3 0 0 0 0 0 0 0 0 0 0 0 0 140 20.0 22.9 21.8 21.8 20.0 20.0 20.0 2266 16.3 0.1 112816.9 17.1 60 0.0 0 0 0 0 0 0 0 0 1 1 4 1 1 1 1 0 25229.0 4665.8 176.3 4658.6 961.9 0.0 0.0 0.0 0.0 199 1763 0 4665.8 0.0 0.0 0 0 0 0 0 0 0 0 0 0 0 0.0 0 0 0.0 0.0 0.0 0 0 0 0 0 0 0 0 14.0 100.0 -20.0 -20.0 53 0 0 0 0 0003 1141 7806 0000 0800 0008 0000 0000"
        client.write(dat);
    }, 500);

});
server.listen(23);





var Hargassner = require("hargassnerTelnet");
var Zentralheizung = new Hargassner({
    IP: "localhost",
    PORT: 23
});

Zentralheizung.connect();

Zentralheizung.on("data", (data) => {
    console.log(data);
})

// Small example to get data with a Express Server
var PORT = 3000;
var LISTENADRESS = "0.0.0.0";


var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send(Zentralheizung.data);
});
app.get('/raw', function(req, res) {
    res.send(Zentralheizung.raw);
});


app.listen(PORT, LISTENADRESS);