const express = require('express');
const app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io');

var port = process.env.PORT || 80;

http.listen(port, () => {
    console.log('listening on *:' + port);
});

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

rl.on('line', (input)=> {
    console.log(`${input}`);
})