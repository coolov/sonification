const webpack = require("webpack");
const config = require('./webpack.config');
const compiler = webpack(config);

// socket server for hot reloading
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// sends a reload event to connected chrome extension
function reload() {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('triggering reload');
      client.send('reload');
    }
  });
}

// start watching the src directory
compiler.watch({}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // todo: pretty-print errors here
    console.log('epic fail :(');
  } else {
    console.log('done!');
    reload();
  }
});

wss.on('connection', function connection(client) {
  console.log('client connected!');
  if (client.readyState === WebSocket.OPEN) {
    client.send('connect');
  }
});
