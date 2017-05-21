var path = require('path');
var webpack = require('webpack');
var express = require('express');
var config = require('./webpack.config');
var detect = require('detect-port');

var app = express();
var compiler = webpack(config);
var DEFAULT_PORT = 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Checks to see if port is open. If not, checks to find the next open port
function checkPort(defaultPort){

    console.log('Checking port ', defaultPort)
    detect(defaultPort).then(function(port){
        if ( port === defaultPort ){
            app.listen(defaultPort, function(err) {
              if (err) {
                return console.error('Error Listening on port',err);
              }
              console.log('Listening at http://localhost:' + defaultPort + '/');
            });
        } else {
            DEFAULT_PORT = defaultPort + 1;
            console.log('Port in use, checking next port')
            checkPort(DEFAULT_PORT)
        }
    })
}

// Start listening on DEFAULT_PORT
checkPort(DEFAULT_PORT)

