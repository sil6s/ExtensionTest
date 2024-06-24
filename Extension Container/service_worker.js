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
