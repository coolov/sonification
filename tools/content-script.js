// Proxy all performance events to the extension
// Can this run in a Web Worker?

// This runs at document_start and will likely be a bit late:
// https://developer.chrome.com/extensions/manifest

// todo: can this run in a worker?
// https://w3c.github.io/performance-timeline/#dom-performanceobserver
const observer = new PerformanceObserver(list => {
  const perfEntries = list.getEntries();
  perfEntries.forEach(entry => {
    // pass message for perf entry to extension
    // https://developer.chrome.com/extensions/messaging
    chrome.runtime.sendMessage({
      type: 'entry',
      entry
    });
  })
});

// provide performance timing for the document
chrome.runtime.sendMessage({
  type: 'init',
  entry: performance.timing
});

observer.observe({
  entryTypes: [
    // https://www.w3.org/TR/resource-timing/
    'resource',
    // https://www.w3.org/TR/navigation-timing/
    'navigation'
  ]
});
