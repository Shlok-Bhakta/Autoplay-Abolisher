// Listen for storage changes and inject/execute the disable script
chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        if (changes.hulu_autoplay) {
            // When hulu_autoplay setting changes, notify all Hulu tabs
            chrome.tabs.query({ url: '*://*.hulu.com/*' }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'checkAutoplayStatus'
                    }).catch(() => {
                        // Tab might not have content script loaded yet, ignore error
                    });
                });
            });
        }
        
        if (changes.youtube_autoplay) {
            // When youtube_autoplay setting changes, notify all YouTube tabs
            chrome.tabs.query({ url: '*://*.youtube.com/*' }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'checkAutoplayStatus'
                    }).catch(() => {
                        // Tab might not have content script loaded yet, ignore error
                    });
                });
            });
        }
    }
});
