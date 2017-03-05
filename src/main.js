const Tone = require('tone');

// creates a synth and connects it to the master output
var synth = new Tone.Synth({
  "oscillator" : {
    "type" : "pwm",
    "modulationFrequency" : 0.2
  },
  "envelope" : {
    "attack" : 0.02,
    "decay" : 0.1,
    "sustain" : 0.2,
    "release" : 0.9,
  }
}).toMaster();

// capture request headers
chrome.webRequest.onSendHeaders
  .addListener(params => {
    synth.triggerAttackRelease("C2", "8n");
  }, {urls: ["<all_urls>"]}, ["requestHeaders"]);
