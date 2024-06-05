<<<<<<< HEAD
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url.includes('github.com')) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
    }
  });
});
=======
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.includes('github.com')) {
    chrome.scripting.registerContentScripts([
      {
        id: 'github-content-script',
        matches: ['*://github.com/*'],
        js: ['content.js'],
        runAt: 'document_end'
      }
    ]).then(() => {
      console.log('Content script registered');
    }).catch((err) => {
      console.error('Error registering content script:', err);
    });
  }
});
>>>>>>> parent of 38f0c2f (Added new flex styles)
