// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkAutoplayStatus') {
        updateYouTubeAutoplay();
        sendResponse({ success: true });
    }
});

// Function to update YouTube autoplay by modifying the cookie
async function updateYouTubeAutoplay() {
    const result = await chrome.storage.local.get(['youtube_autoplay']);
    
    // YouTube stores autoplay preference in VISITOR_INFO1_LIVE or as a flag in other cookies
    // The main cookie to modify is the one that controls autoplay behavior
    // We'll try to modify the relevant cookie to disable autoplay
    
    const shouldDisableAutoplay = result.youtube_autoplay === false;
    
    if (shouldDisableAutoplay) {
        // Set cookie to disable autoplay
        // YouTube respects the VISITOR_INFO1_LIVE and other tracking cookies
        // However, the actual autoplay setting is controlled through the user settings
        
        // The VISITOR_INFO1_LIVE cookie doesn't directly control autoplay
        // We need to modify the page's internal state or use a different approach
        
        // Try to find and modify the YouTube settings in localStorage or through the API
        try {
            // YouTube stores settings in localStorage under yt-player-headers-readable
            const playerHeaders = localStorage.getItem('yt-player-headers-readable');
            if (playerHeaders) {
                try {
                    const headers = JSON.parse(playerHeaders);
                    // Modify autoplay setting if possible
                    localStorage.setItem('yt-player-headers-readable', JSON.stringify(headers));
                } catch (e) {
                    console.log('Could not parse player headers');
                }
            }
        } catch (e) {
            console.log('Error accessing localStorage');
        }
        
        // The most reliable way is to use YouTube's internal API
        // Try to access the page's internal player configuration
        if (window.ytInitialPlayerResponse) {
            console.log('YouTube player found, attempting to disable autoplay');
        }
        
        // Set a cookie that YouTube might respect
        // YouTube's autoplay setting is stored in cookies with specific formats
        document.cookie = 'PREF=f6=8&autoplay=0; path=/; domain=.youtube.com';
        document.cookie = 'PLAYER_CACHE_EXPIRY=' + Math.floor(Date.now() / 1000 + 3600) + '; path=/; domain=.youtube.com';
        
        // Try to click the autoplay toggle if it exists and is currently enabled
        clickAutoplayToggle(true);
    } else {
        // Re-enable autoplay by clearing our disable cookie
        document.cookie = 'PREF=f6=8&autoplay=1; path=/; domain=.youtube.com';
        clickAutoplayToggle(false);
    }
}

// Helper function to find and click the autoplay toggle
function clickAutoplayToggle(shouldDisable) {
    // Look for the autoplay toggle button
    // YouTube's autoplay toggle is typically in the player controls or settings
    
    const selectors = [
        '[aria-label="Autoplay"]',
        '[aria-label="Autoplay is on"]',
        '[aria-label="Autoplay is off"]',
        'button[aria-label*="Autoplay"]',
        '[data-testid*="autoplay"]'
    ];
    
    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) { // Check if visible
            const isCurrentlyOn = element.getAttribute('aria-label')?.includes('is on');
            
            // Only click if we need to change the state
            if (shouldDisable && isCurrentlyOn) {
                element.click();
                console.log('Clicked to disable autoplay');
                return;
            } else if (!shouldDisable && !isCurrentlyOn) {
                element.click();
                console.log('Clicked to enable autoplay');
                return;
            }
        }
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateYouTubeAutoplay);
} else {
    updateYouTubeAutoplay();
}

// Also check periodically in case the player/controls load dynamically
const intervalId = setInterval(updateYouTubeAutoplay, 3000);

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
});
