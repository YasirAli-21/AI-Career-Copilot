// lib/withTimeout.js
//
// DAY 8: Wraps a promise with a timeout, so a hung AI API call fails with a
// clear, user-facing error instead of leaving the loading spinner spinning
// forever or hitting Vercel's raw platform timeout.

function withTimeout(promise, ms, timeoutMessage) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

module.exports = withTimeout;
