// Background service worker for PromptHive extension

declare const chrome: any;

// Handle extension installation
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onInstalled.addListener(() => {
    console.log('PromptHive extension installed');
  });

  // Handle messages from content script and popup
  chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
    if (message.type === 'SAVE_PROMPT') {
      // Store the prompt data in Chrome storage for the popup to access
      chrome.storage.local.set({
        pendingPrompt: message.data
      }, () => {
        // Notify content script that prompt was saved
        if (sender.tab?.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            type: 'PROMPT_SAVED'
          });
        }
      });
    }
    
    if (message.type === 'GET_PENDING_PROMPT') {
      chrome.storage.local.get(['pendingPrompt'], (result: any) => {
        sendResponse(result.pendingPrompt);
        // Clear the pending prompt after retrieval
        chrome.storage.local.remove(['pendingPrompt']);
      });
      return true; // Keep message channel open for async response
    }
  });
}