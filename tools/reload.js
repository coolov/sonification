// todo: maybe delay 10 seconds to prevent a "fast reload"?
// http://stackoverflow.com/a/29087151
function enableHotReloading() {
  var ws = new WebSocket('ws://localhost:8080');
  ws.onmessage = function (event) {
    if (event.data === 'connect') {
      console.log('connected to dev server');
    }
    if (event.data === 'reload') {
      console.log('reloading extension');
      chrome.runtime.reload();
    }
  };
}

enableHotReloading();
