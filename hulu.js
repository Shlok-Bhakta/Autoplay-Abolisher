// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkAutoplayStatus') {
        disableHuluAutoplay();
        sendResponse({ success: true });
    }
});

// Function to disable Hulu autoplay
async function disableHuluAutoplay() {
    const result = await chrome.storage.local.get(['hulu_autoplay']);
    
    // Only proceed if autoplay is disabled (hulu_autoplay === false)
    if (result.hulu_autoplay !== false) {
        return;
    }

    // Try multiple methods to find and disable autoplay
    
    // Method 1: Look for the autoplay toggle in the player settings
    // Hulu's autoplay toggle might be in player controls with various possible selectors
    const selectors = [
        '[aria-label*="autoplay" i]',
        '[title*="autoplay" i]',
        '[data-testid*="autoplay"]',
        'button[aria-pressed="true"][aria-label*="autoplay" i]',
        '.autoplay-toggle',
        '[role="switch"][aria-label*="autoplay" i]'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) { // Check if visible
            element.click();
            console.log('Clicked autoplay toggle:', selector);
            return;
        }
    }

    // Method 2: Look in the player controls menu
    const playerSettings = document.querySelector('[data-testid="player-settings"], .player-settings, [class*="settings"]');
    if (playerSettings) {
        const autoplayOption = Array.from(playerSettings.querySelectorAll('*')).find(el => 
            el.textContent.toLowerCase().includes('autoplay')
        );
        if (autoplayOption) {
            autoplayOption.click();
            console.log('Clicked autoplay from settings menu');
            return;
        }
    }

    // Method 3: Search for any element containing 'autoplay' text that's clickable
    const allElements = document.querySelectorAll('button, [role="button"], [role="switch"], label, [class*="toggle"]');
    for (const el of allElements) {
        if (el.textContent.toLowerCase().includes('autoplay') || 
            el.getAttribute('aria-label')?.toLowerCase().includes('autoplay')) {
            el.click();
            console.log('Found and clicked autoplay element');
            return;
        }
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableHuluAutoplay);
} else {
    disableHuluAutoplay();
}

// Also check periodically in case the player/controls load dynamically
const intervalId = setInterval(disableHuluAutoplay, 3000);

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
});
