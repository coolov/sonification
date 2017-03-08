const Tone = require('tone');

// will be set by the first message
// contains the performance.timing object
// https://www.w3.org/TR/navigation-timing/timing-overview.png
let performanceTiming = null;

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

function handlePerfomanceEntry(entry) {
  console.log(
    'PER',
    entry.name,
    // type: double
    // the unit is milliseconds and should be accurate to 5 µs (microseconds).
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp
    // relative to navigation start (http://stackoverflow.com/a/21454678)
    performanceTiming.navigationStart + entry.startTime,
    performanceTiming.navigationStart + entry.responseEnd
  );
}

// capture request headers
// https://developer.chrome.com/extensions/webRequest
// todo: compare to https://developer.chrome.com/extensions/webNavigation
chrome.webRequest.onBeforeRequest
  .addListener(message => {
    console.log(
      'BEF',
      message.url,

      // type: double
      // The time when this signal is triggered, in milliseconds since the epoch.
      // The timestamp property of web request events is only guaranteed to be internally consistent.
      // Comparing one event to another event will give you the correct offset between them,
      // but comparing them to the current time inside the extension (via (new Date()).getTime(),
      // for instance) might give unexpected results.
      message.timeStamp
    );
    //synth.triggerAttackRelease("C2", "8n");
  }, {urls: ["<all_urls>"]});

chrome.webRequest.onCompleted
  .addListener(message => {
    console.log(
      'AFT',
      message.url,
      message.timeStamp
    );
  }, {urls: ["<all_urls>"]});

// receive message from content script
// https://developer.chrome.com/extensions/messaging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { entry, type } = request;
  switch(type) {
    case 'init':
      console.log('init content script');
      performanceTiming = entry;
      break;

    case 'entry':
      // dispatches performance entries, delivered by the PerformanceObserver
      // https://w3c.github.io/performance-timeline/#dom-performanceentry
      handlePerfomanceEntry(entry);
      break;
  }
});
