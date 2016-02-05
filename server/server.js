/**
 * sample node server for webpack-entry-router
 * this server do 2 things:
 * 1. serve '../public/' as public path
 * 2. handle 'GET' request to '/', '/signup' and '/detail'
 *
 * you should adjust this to satisfy ur own demand
 *
 */
var express = require('express');
var path = require('path');
var app = express();
var port = 3000;

// public folder
var publicConfig = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
};

app.use('/public', express.static(path.resolve(__dirname, '../public'), publicConfig));

app.get(/\/(detail|signup)?$/, function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Express app listening at http://%s:%s', host, port);
});
