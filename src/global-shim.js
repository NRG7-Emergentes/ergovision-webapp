// Polyfill for Node.js global variables in browser environment
(function() {
  if (typeof window !== 'undefined') {
    window.global = window;

    // Also polyfill process if needed by some libraries
    if (typeof window.process === 'undefined') {
      window.process = {
        env: {},
        nextTick: function(fn) {
          setTimeout(fn, 0);
        }
      };
    }
  }
})();

