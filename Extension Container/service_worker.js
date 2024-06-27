// Flag to track if the content script has been registered
let contentScriptRegistered = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('github.com')) {
    // Check if the content script has already been registered
    if (!contentScriptRegistered) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).then(() => {
        console.log('Content script executed');
        contentScriptRegistered = true;
      }).catch((err) => {
        console.error('Error executing content script:', err);
      });
    }
  }
});